// server/src/managers/RoomManager.ts
import * as mediasoup from 'mediasoup';
import { EventEmitter } from 'events';
import { Config } from '../config';
import { Logger } from '../utils/logger';
import { WorkerManager } from './workerManager';
import { 
  Room, 
  Peer, 
  RoomConfig, 
  PeerInfo,
  RoomStats,
  RoomEvents 
} from '../types';
import { Consumer, Producer } from 'mediasoup/node/lib/types';

export class RoomManager extends EventEmitter {
  private static instance: RoomManager;
  private rooms: Map<string, Room> = new Map();
  private readonly logger: Logger;
  private readonly config: Config;
  private readonly workerManager: WorkerManager;
  private readonly roomConfig: RoomConfig;

  private constructor() {
    super();
    this.logger = Logger.create('RoomManager');
    this.config = Config.getInstance();
    this.workerManager = WorkerManager.getInstance();
    this.roomConfig = this.config.getRoomConfig();
  }

  public static getInstance(): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  public async createRoom(roomId: string): Promise<Room> {
    try {
      if (this.rooms.has(roomId)) {
        this.logger.warn('Room already exists', { roomId });
        return this.rooms.get(roomId)!;
      }

      this.logger.info('Creating new room', { roomId });

      // Get a worker for this room
      const worker = this.workerManager.getWorker();
      
      // Create MediaSoup router
      const router = await worker.createRouter({
        mediaCodecs: this.roomConfig.mediaCodecs
      });

      // Setup router event handlers
      this.setupRouterEventHandlers(router, roomId);

      const room: Room = {
        id: roomId,
        router,
        peers: new Map(),
        createdAt: new Date(),
        lastActivity: new Date(),
        maxPeers: this.roomConfig.maxPeers,
        isActive: true
      };

      this.rooms.set(roomId, room);

      this.logger.info('Room created successfully', {
        roomId,
        routerId: router.id,
        workerId: worker.pid
      });

      this.emit(RoomEvents.ROOM_CREATED, { roomId, room });

      return room;
    } catch (error) {
      this.logger.error('Failed to create room', { error, roomId });
      throw error;
    }
  }

  public async getOrCreateRoom(roomId: string): Promise<Room> {
    const existingRoom = this.rooms.get(roomId);
    if (existingRoom && existingRoom.isActive) {
      this.updateRoomActivity(roomId);
      return existingRoom;
    }

    return this.createRoom(roomId);
  }

  public getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  public getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  public getActiveRooms(): Room[] {
    return Array.from(this.rooms.values()).filter(room => room.isActive);
  }

  public async addPeerToRoom(roomId: string, peerId: string, peerInfo: PeerInfo): Promise<Peer> {
    try {
      const room = await this.getOrCreateRoom(roomId);

      if (room.peers.has(peerId)) {
        this.logger.warn('Peer already exists in room', { roomId, peerId });
        return room.peers.get(peerId)!;
      }

      if (room.peers.size >= room.maxPeers) {
        throw new Error(`Room ${roomId} has reached maximum capacity of ${room.maxPeers} peers`);
      }

      const peer: Peer = {
        id: peerId,
        roomId,
        info: peerInfo,
        transports: new Map(),
        producers: new Map(),
        consumers: new Map(),
        joinedAt: new Date(),
        lastSeen: new Date(),
        isConnected: true
      };

      room.peers.set(peerId, peer);
      this.updateRoomActivity(roomId);

      this.logger.info('Peer added to room', {
        roomId,
        peerId,
        peerCount: room.peers.size,
        peerInfo
      });

      this.emit(RoomEvents.PEER_JOINED, { roomId, peerId, peer, room });

      return peer;
    } catch (error) {
      this.logger.error('Failed to add peer to room', { error, roomId, peerId });
      throw error;
    }
  }

  public async removePeerFromRoom(roomId: string, peerId: string): Promise<void> {
    try {
      const room = this.getRoom(roomId);
      if (!room) {
        this.logger.warn('Room not found when removing peer', { roomId, peerId });
        return;
      }

      const peer = room.peers.get(peerId);
      if (!peer) {
        this.logger.warn('Peer not found in room', { roomId, peerId });
        return;
      }

      // Close all peer's transports, producers, and consumers
      await this.cleanupPeer(peer);

      room.peers.delete(peerId);
      this.updateRoomActivity(roomId);

      this.logger.info('Peer removed from room', {
        roomId,
        peerId,
        remainingPeers: room.peers.size
      });

      this.emit(RoomEvents.PEER_LEFT, { roomId, peerId, peer, room });

      // Close room if empty and inactive
      if (room.peers.size === 0) {
        await this.scheduleRoomCleanup(roomId);
      }
    } catch (error) {
      this.logger.error('Failed to remove peer from room', { error, roomId, peerId });
      throw error;
    }
  }

  public getPeer(roomId: string, peerId: string): Peer | undefined {
    const room = this.getRoom(roomId);
    return room?.peers.get(peerId);
  }

  public getRoomPeers(roomId: string): Peer[] {
    const room = this.getRoom(roomId);
    return room ? Array.from(room.peers.values()) : [];
  }

  public getOtherPeersInRoom(roomId: string, excludePeerId: string): Peer[] {
    return this.getRoomPeers(roomId).filter(peer => peer.id !== excludePeerId);
  }

  public async closeRoom(roomId: string): Promise<void> {
    try {
      const room = this.getRoom(roomId);
      if (!room) {
        this.logger.warn('Room not found when closing', { roomId });
        return;
      }

      this.logger.info('Closing room', { roomId, peerCount: room.peers.size });

      // Remove all peers
      const peerIds = Array.from(room.peers.keys());
      for (const peerId of peerIds) {
        await this.removePeerFromRoom(roomId, peerId);
      }

      // Close router
      if (!room.router.closed) {
        room.router.close();
      }

      room.isActive = false;
      this.rooms.delete(roomId);

      this.logger.info('Room closed successfully', { roomId });
      this.emit(RoomEvents.ROOM_CLOSED, { roomId, room });
    } catch (error) {
      this.logger.error('Failed to close room', { error, roomId });
      throw error;
    }
  }

  public getRoomStats(roomId: string): RoomStats | undefined {
    const room = this.getRoom(roomId);
    if (!room) return undefined;

    const peers = Array.from(room.peers.values());
    const connectedPeers = peers.filter(peer => peer.isConnected);

    return {
      roomId,
      peerCount: room.peers.size,
      connectedPeerCount: connectedPeers.length,
      createdAt: room.createdAt,
      lastActivity: room.lastActivity,
      routerId: room.router.id,
      isActive: room.isActive,
      totalProducers: peers.reduce((sum, peer) => sum + peer.producers.size, 0),
      totalConsumers: peers.reduce((sum, peer) => sum + peer.consumers.size, 0),
      totalTransports: peers.reduce((sum, peer) => sum + peer.transports.size, 0)
    };
  }

  public getAllRoomStats(): RoomStats[] {
    return Array.from(this.rooms.keys())
      .map(roomId => this.getRoomStats(roomId))
      .filter((stats): stats is RoomStats => stats !== undefined);
  }

  public updatePeerLastSeen(roomId: string, peerId: string): void {
    const peer = this.getPeer(roomId, peerId);
    if (peer) {
      peer.lastSeen = new Date();
      this.updateRoomActivity(roomId);
    }
  }

  public setPeerConnectionStatus(roomId: string, peerId: string, isConnected: boolean): void {
    const peer = this.getPeer(roomId, peerId);
    if (peer) {
      peer.isConnected = isConnected;
      this.updateRoomActivity(roomId);
      
      this.emit(RoomEvents.PEER_CONNECTION_CHANGED, { 
        roomId, 
        peerId, 
        peer, 
        isConnected 
      });
    }
  }

  private setupRouterEventHandlers(router: mediasoup.types.Router, roomId: string): void {
    router.observer.on('close', () => {
      this.logger.info('Router closed', { roomId, routerId: router.id });
    });

    router.observer.on('newtransport', (transport) => {
      this.logger.debug('New transport created', {
        roomId,
        routerId: router.id,
        transportId: transport.id,
        transportType: transport.constructor.name
      });
    });

    (router.observer as any).on('newproducer', (producer: Producer) => {
      this.logger.debug('New producer created', {
        roomId,
        routerId: router.id,
        producerId: producer.id,
        kind: producer.kind
      });
    });

    (router.observer as any).on('newconsumer', (consumer: Consumer) => {
      this.logger.debug('New consumer created', {
        roomId,
        routerId: router.id,
        consumerId: consumer.id,
        kind: consumer.kind
      });
    });
  }

  private async cleanupPeer(peer: Peer): Promise<void> {
    try {
      // Close all consumers
      for (const consumer of peer.consumers.values()) {
        if (!consumer.closed) {
          consumer.close();
        }
      }
      peer.consumers.clear();

      // Close all producers
      for (const producer of peer.producers.values()) {
        if (!producer.closed) {
          producer.close();
        }
      }
      peer.producers.clear();

      // Close all transports
      for (const transport of peer.transports.values()) {
        if (!transport.closed) {
          transport.close();
        }
      }
      peer.transports.clear();

      this.logger.debug('Peer cleanup completed', { 
        peerId: peer.id, 
        roomId: peer.roomId 
      });
    } catch (error) {
      this.logger.error('Error during peer cleanup', { 
        error, 
        peerId: peer.id, 
        roomId: peer.roomId 
      });
    }
  }

  private updateRoomActivity(roomId: string): void {
    const room = this.getRoom(roomId);
    if (room) {
      room.lastActivity = new Date();
    }
  }

  private async scheduleRoomCleanup(roomId: string, delayMs: number = 30000): Promise<void> {
    setTimeout(async () => {
      const room = this.getRoom(roomId);
      if (room && room.peers.size === 0) {
        await this.closeRoom(roomId);
      }
    }, delayMs);
  }

  public async cleanup(): Promise<void> {
    try {
      this.logger.info('Starting room manager cleanup');
      
      const roomIds = Array.from(this.rooms.keys());
      for (const roomId of roomIds) {
        await this.closeRoom(roomId);
      }

      this.rooms.clear();
      this.removeAllListeners();
      
      this.logger.info('Room manager cleanup completed');
    } catch (error) {
      this.logger.error('Error during room manager cleanup', error as Error);
      throw error;
    }
  }

  public getRoomCount(): number {
    return this.rooms.size;
  }

  public getActiveRoomCount(): number {
    return this.getActiveRooms().length;
  }

  public getTotalPeerCount(): number {
    return Array.from(this.rooms.values())
      .reduce((total, room) => total + room.peers.size, 0);
  }
}