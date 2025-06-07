// server/src/handlers/SocketHandler.ts
import { Server, Socket } from "socket.io";
import { Logger } from "../utils/logger";
import { RoomManager } from "../mediasoup/roomManager";
import { TransportManager } from "../mediasoup/transportManager";
import {
  TransportType,
  TransportEvents,
  RoomEvents,
  CreateTransportRequest,
  ConnectTransportRequest,
  ProduceRequest,
  ConsumeRequest,
  PeerInfo,
} from "../types";

export class SocketHandler {
  private readonly logger: Logger;
  private readonly roomManager: RoomManager;
  private readonly transportManager: TransportManager;
  private readonly io: Server;

  constructor(io: Server) {
    this.logger = Logger.create("SocketHandler");
    this.roomManager = RoomManager.getInstance();
    this.transportManager = TransportManager.getInstance();
    this.io = io;

    this.setupEventListeners();
    this.setupSocketHandlers();
  }

  private setupEventListeners(): void {
    // Listen to room events
    this.roomManager.on(RoomEvents.PEER_JOINED, (data) => {
      this.handlePeerJoined(data);
    });

    this.roomManager.on(RoomEvents.PEER_LEFT, (data) => {
      this.handlePeerLeft(data);
    });

    // Listen to transport events
    this.transportManager.on(TransportEvents.NEW_PRODUCER_AVAILABLE, (data) => {
      this.handleNewProducerAvailable(data);
    });

    this.transportManager.on(
      TransportEvents.PRODUCER_CLOSED_NOTIFICATION,
      (data) => {
        this.handleProducerClosed(data);
      }
    );
  }

  private setupSocketHandlers(): void {
    this.io.on("connection", (socket: Socket) => {
      this.logger.info("Client connected", { socketId: socket.id });

      // Store socket metadata
      socket.data = {
        peerId: socket.id,
        roomId: null,
        isConnected: true,
      };

      // Register all socket event handlers
      this.registerSocketEvents(socket);

      socket.on("disconnect", () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private registerSocketEvents(socket: Socket): void {
    // Room management
    socket.on("join-room", (data, callback) => {
      this.handleJoinRoom(socket, data, callback);
    });

    socket.on("leave-room", (data, callback) => {
      this.handleLeaveRoom(socket, data, callback);
    });

    socket.on("get-router-rtp-capabilities", (callback) => {
      this.handleGetRouterRtpCapabilities(socket, callback);
    });

    // Transport management
    socket.on("create-webrtc-transport", (data, callback) => {
      this.handleCreateWebRtcTransport(socket, data, callback);
    });

    socket.on("connect-transport", (data, callback) => {
      this.handleConnectTransport(socket, data, callback);
    });

    // Producer management
    socket.on("produce", (data, callback) => {
      this.handleProduce(socket, data, callback);
    });

    socket.on("close-producer", (data, callback) => {
      this.handleCloseProducer(socket, data, callback);
    });

    // Consumer management
    socket.on("consume", (data, callback) => {
      this.handleConsume(socket, data, callback);
    });

    socket.on("resume-consumer", (data, callback) => {
      this.handleResumeConsumer(socket, data, callback);
    });

    socket.on("pause-consumer", (data, callback) => {
      this.handlePauseConsumer(socket, data, callback);
    });

    socket.on("close-consumer", (data, callback) => {
      this.handleCloseConsumer(socket, data, callback);
    });

    // Statistics
    socket.on("get-transport-stats", (data, callback) => {
      this.handleGetTransportStats(socket, data, callback);
    });

    socket.on("get-producer-stats", (data, callback) => {
      this.handleGetProducerStats(socket, data, callback);
    });

    socket.on("get-consumer-stats", (data, callback) => {
      this.handleGetConsumerStats(socket, data, callback);
    });

    socket.on("get-room-stats", (data, callback) => {
      this.handleGetRoomStats(socket, data, callback);
    });
  }

  private async handleJoinRoom(
    socket: Socket,
    data: { roomId: string; peerInfo?: PeerInfo },
    callback: Function
  ): Promise<void> {
    try {
      const { roomId, peerInfo = {} } = data;
      const peerId = socket.id;

      this.logger.info("Peer joining room", { roomId, peerId, peerInfo });

      // Create or get room
      const room = await this.roomManager.getOrCreateRoom(roomId);

      // Add peer to room
      const peer = await this.roomManager.addPeerToRoom(roomId, peerId, {
        ...peerInfo,
        id: peerId,
        socket,
        roomId,
      });

      // Update socket data
      socket.data.roomId = roomId;
      socket.join(roomId);

      // Get existing producers in the room
      const existingPeers = this.roomManager.getOtherPeersInRoom(
        roomId,
        peerId
      );
      const existingProducers = existingPeers.flatMap((peer) =>
        Array.from(peer.producers.values()).map((producer) => ({
          peerId: peer.id,
          producerId: producer.id,
          kind: producer.kind,
        }))
      );

      callback({
        success: true,
        data: {
          roomId,
          peerId,
          routerRtpCapabilities: room.router.rtpCapabilities,
          existingProducers,
        },
      });

      this.logger.info("Peer joined room successfully", { roomId, peerId });
    } catch (error) {
      this.logger.error("Failed to join room", {
        error,
        roomId: data.roomId,
        peerId: socket.id,
      });
      callback({ success: false, error: (error as Error).message });
    }
  }

  private async handleLeaveRoom(
    socket: Socket,
    data: { roomId?: string },
    callback: Function
  ): Promise<void> {
    try {
      const roomId = data.roomId || socket.data.roomId;
      const peerId = socket.id;

      if (!roomId) {
        callback({ success: false, error: "No room to leave" });
        return;
      }

      this.logger.info("Peer leaving room", { roomId, peerId });

      await this.roomManager.removePeerFromRoom(roomId, peerId);
      socket.leave(roomId);
      socket.data.roomId = null;

      callback({ success: true });

      this.logger.info("Peer left room successfully", { roomId, peerId });
    } catch (error) {
      this.logger.error("Failed to leave room", {
        error,
        roomId: data.roomId,
        peerId: socket.id,
      });
      callback({ success: false, error: (error as Error).message });
    }
  }

  private handleGetRouterRtpCapabilities(
    socket: Socket,
    callback: Function
  ): void {
    try {
      const roomId = socket.data.roomId;
      if (!roomId) {
        callback({ success: false, error: "Not in a room" });
        return;
      }

      const room = this.roomManager.getRoom(roomId);
      if (!room) {
        callback({ success: false, error: "Room not found" });
        return;
      }

      callback({
        success: true,
        data: room.router.rtpCapabilities,
      });
    } catch (error) {
      this.logger.error(
        "Failed to get router RTP capabilities",
        error as Error
      );
      callback({ success: false, error: (error as Error).message });
    }
  }

  private async handleCreateWebRtcTransport(
    socket: Socket,
    data: { type: TransportType },
    callback: Function
  ): Promise<void> {
    try {
      const { type } = data;
      const roomId = socket.data.roomId;
      const peerId = socket.id;

      if (!roomId) {
        callback({ success: false, error: "Not in a room" });
        return;
      }

      this.logger.info("Creating WebRTC transport", { roomId, peerId, type });

      const { transport, params } =
        await this.transportManager.createWebRtcTransport(roomId, peerId, type);

      callback({
        success: true,
        data: params,
      });

      this.logger.info("WebRTC transport created successfully", {
        roomId,
        peerId,
        type,
        transportId: transport.id,
      });
    } catch (error) {
      this.logger.error("Failed to create WebRTC transport", {
        error,
        peerId: socket.id,
        type: data.type,
      });
      callback({ success: false, error: (error as Error).message });
    }
  }

  private async handleConnectTransport(
    socket: Socket,
    data: { transportId: string; dtlsParameters: any },
    callback: Function
  ): Promise<void> {
    try {
      const { transportId, dtlsParameters } = data;
      const roomId = socket.data.roomId;
      const peerId = socket.id;

      if (!roomId) {
        callback({ success: false, error: "Not in a room" });
        return;
      }

      await this.transportManager.connectTransport(
        roomId,
        peerId,
        transportId,
        dtlsParameters
      );

      callback({ success: true });
    } catch (error) {
      this.logger.error("Failed to connect transport", {
        error,
        peerId: socket.id,
        transportId: data.transportId,
      });
      callback({ success: false, error: (error as Error).message });
    }
  }

  private async handleProduce(
    socket: Socket,
    data: {
      transportId: string;
      kind: string;
      rtpParameters: any;
      appData?: any;
    },
    callback: Function
  ): Promise<void> {
    try {
      const { transportId, kind, rtpParameters, appData } = data;
      const roomId = socket.data.roomId;
      const peerId = socket.id;

      if (!roomId) {
        callback({ success: false, error: "Not in a room" });
        return;
      }

      const producer = await this.transportManager.createProducer(
        roomId,
        peerId,
        transportId,
        rtpParameters,
        kind as any,
        appData
      );

      callback({
        success: true,
        data: { id: producer.id },
      });
    } catch (error) {
      this.logger.error("Failed to produce", {
        error,
        peerId: socket.id,
        transportId: data.transportId,
        kind: data.kind,
      });
      callback({ success: false, error: (error as Error).message });
    }
  }

  private async handleConsume(
    socket: Socket,
    data: { transportId: string; producerId: string; rtpCapabilities: any },
    callback: Function
  ): Promise<void> {
    try {
      const { transportId, producerId, rtpCapabilities } = data;
      const roomId = socket.data.roomId;
      const peerId = socket.id;

      if (!roomId) {
        callback({ success: false, error: "Not in a room" });
        return;
      }

      const { consumer, params } = await this.transportManager.createConsumer(
        roomId,
        peerId,
        transportId,
        producerId,
        rtpCapabilities
      );

      callback({
        success: true,
        data: params,
      });
    } catch (error) {
      this.logger.error("Failed to consume", {
        error,
        peerId: socket.id,
        transportId: data.transportId,
        producerId: data.producerId,
      });
      callback({ success: false, error: (error as Error).message });
    }
  }

  private async handleResumeConsumer(
    socket: Socket,
    data: { consumerId: string },
    callback: Function
  ): Promise<void> {
    try {
      const { consumerId } = data;
      const roomId = socket.data.roomId;
      const peerId = socket.id;

      if (!roomId) {
        callback({ success: false, error: "Not in a room" });
        return;
      }

      await this.transportManager.resumeConsumer(roomId, peerId, consumerId);
      callback({ success: true });
    } catch (error) {
      this.logger.error("Failed to resume consumer", {
        error,
        peerId: socket.id,
        consumerId: data.consumerId,
      });
      callback({ success: false, error: (error as Error).message });
    }
  }

  private async handlePauseConsumer(
    socket: Socket,
    data: { consumerId: string },
    callback: Function
  ): Promise<void> {
    try {
      const { consumerId } = data;
      const roomId = socket.data.roomId;
      const peerId = socket.id;

      if (!roomId) {
        callback({ success: false, error: "Not in a room" });
        return;
      }

      await this.transportManager.pauseConsumer(roomId, peerId, consumerId);
      callback({ success: true });
    } catch (error) {
      this.logger.error("Failed to pause consumer", {
        error,
        peerId: socket.id,
        consumerId: data.consumerId,
      });
      callback({ success: false, error: (error as Error).message });
    }
  }

  private async handleCloseProducer(
    socket: Socket,
    data: { producerId: string },
    callback: Function
  ): Promise<void> {
    try {
      const { producerId } = data;
      const roomId = socket.data.roomId;
      const peerId = socket.id;

      if (!roomId) {
        callback({ success: false, error: "Not in a room" });
        return;
      }

      await this.transportManager.closeProducer(roomId, peerId, producerId);
      callback({ success: true });
    } catch (error) {
      this.logger.error("Failed to close producer", {
        error,
        peerId: socket.id,
        producerId: data.producerId,
      });
      callback({ success: false, error: (error as Error).message });
    }
  }

  private async handleCloseConsumer(
    socket: Socket,
    data: { consumerId: string },
    callback: Function
  ): Promise<void> {
    try {
      const { consumerId } = data;
      const roomId = socket.data.roomId;
      const peerId = socket.id;

      if (!roomId) {
        callback({ success: false, error: "Not in a room" });
        return;
      }

      await this.transportManager.closeConsumer(roomId, peerId, consumerId);
      callback({ success: true });
    } catch (error) {
      this.logger.error("Failed to close consumer", {
        error,
        peerId: socket.id,
        consumerId: data.consumerId,
      });
      callback({ success: false, error: (error as Error).message });
    }
  }

  private async handleGetTransportStats(
    socket: Socket,
    data: { transportId: string },
    callback: Function
  ): Promise<void> {
    try {
      const { transportId } = data;
      const roomId = socket.data.roomId;
      const peerId = socket.id;

      if (!roomId) {
        callback({ success: false, error: "Not in a room" });
        return;
      }

      const stats = await this.transportManager.getTransportStats(
        roomId,
        peerId,
        transportId
      );
      callback({ success: true, data: stats });
    } catch (error) {
      this.logger.error("Failed to get transport stats", error as Error);
      callback({ success: false, error: (error as Error).message });
    }
  }

  private async handleGetProducerStats(
    socket: Socket,
    data: { producerId: string },
    callback: Function
  ): Promise<void> {
    try {
      const { producerId } = data;
      const roomId = socket.data.roomId;
      const peerId = socket.id;

      if (!roomId) {
        callback({ success: false, error: "Not in a room" });
        return;
      }

      const stats = await this.transportManager.getProducerStats(
        roomId,
        peerId,
        producerId
      );
      callback({ success: true, data: stats });
    } catch (error) {
      this.logger.error("Failed to get producer stats", error as Error);
      callback({ success: false, error: (error as Error).message });
    }
  }

  private async handleGetConsumerStats(
    socket: Socket,
    data: { consumerId: string },
    callback: Function
  ): Promise<void> {
    try {
      const { consumerId } = data;
      const roomId = socket.data.roomId;
      const peerId = socket.id;

      if (!roomId) {
        callback({ success: false, error: "Not in a room" });
        return;
      }

      const stats = await this.transportManager.getConsumerStats(
        roomId,
        peerId,
        consumerId
      );
      callback({ success: true, data: stats });
    } catch (error) {
      this.logger.error("Failed to get consumer stats", error as Error);
      callback({ success: false, error: (error as Error).message });
    }
  }

  private handleGetRoomStats(
    socket: Socket,
    data: any,
    callback: Function
  ): void {
    try {
      const roomId = socket.data.roomId;
      if (!roomId) {
        callback({ success: false, error: "Not in a room" });
        return;
      }

      const stats = this.roomManager.getRoomStats(roomId);
      callback({ success: true, data: stats });
    } catch (error) {
      this.logger.error("Failed to get room stats", error as Error);
      callback({ success: false, error: (error as Error).message });
    }
  }

  private async handleDisconnect(socket: Socket): Promise<void> {
    try {
      const peerId = socket.id;
      const roomId = socket.data.roomId;

      this.logger.info("Client disconnected", { peerId, roomId });

      if (roomId) {
        await this.roomManager.removePeerFromRoom(roomId, peerId);
      }
    } catch (error) {
      this.logger.error("Error handling disconnect", {
        error,
        peerId: socket.id,
      });
    }
  }

  private handlePeerJoined(data: any): void {
    const { roomId, peerId, peer } = data;

    // Notify other peers in the room
    this.io.to(roomId).except(peerId).emit("peer-joined", {
      peerId,
      peerInfo: peer.info,
    });
  }

  private handlePeerLeft(data: any): void {
    const { roomId, peerId } = data;

    // Notify other peers in the room
    this.io.to(roomId).except(peerId).emit("peer-left", {
      peerId,
    });
  }

  private handleNewProducerAvailable(data: any): void {
    const { roomId, producerPeerId, producerId, kind, targetPeers } = data;

    // Notify specific peers about new producer
    targetPeers.forEach((peerId: string) => {
      this.io.to(peerId).emit("new-producer", {
        producerPeerId,
        producerId,
        kind,
      });
    });
  }

  private handleProducerClosed(data: any): void {
    const { roomId, producerPeerId, producerId, targetPeers } = data;

    // Notify specific peers about producer closure
    targetPeers.forEach((peerId: string) => {
      this.io.to(peerId).emit("producer-closed", {
        producerPeerId,
        producerId,
      });
    });
  }
}
