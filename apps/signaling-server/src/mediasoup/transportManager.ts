// server/src/managers/TransportManager.ts
import * as mediasoup from 'mediasoup';
import { EventEmitter } from 'events';
import { Config } from '../config';
import { Logger } from '../utils/logger';
import { RoomManager } from './roomManager';
import {
  TransportOptions,
  TransportType,
  TransportEvents,
  TransportEventData,
  CreateTransportRequest,
  ConnectTransportRequest,
  ProduceRequest,
  ConsumeRequest,
  TransportStats
} from '../types';

export class TransportManager extends EventEmitter {
  private static instance: TransportManager;
  private readonly logger: Logger;
  private readonly config: Config;
  private readonly roomManager: RoomManager;
  private readonly webRtcTransportOptions: any;

  private constructor() {
    super();
    this.logger = Logger.create('TransportManager');
    this.config = Config.getInstance();
    this.roomManager = RoomManager.getInstance();
    this.webRtcTransportOptions = this.config.getWebRtcTransportOptions();
  }

  public static getInstance(): TransportManager {
    if (!TransportManager.instance) {
      TransportManager.instance = new TransportManager();
    }
    return TransportManager.instance;
  }

  public async createWebRtcTransport(
    roomId: string,
    peerId: string,
    type: TransportType
  ): Promise<{
    transport: mediasoup.types.WebRtcTransport;
    params: {
      id: string;
      iceParameters: mediasoup.types.IceParameters;
      iceCandidates: mediasoup.types.IceCandidate[];
      dtlsParameters: mediasoup.types.DtlsParameters;
    };
  }> {
    try {
      this.logger.info('Creating WebRTC transport', { roomId, peerId, type });

      const room = this.roomManager.getRoom(roomId);
      if (!room) {
        throw new Error(`Room ${roomId} not found`);
      }

      const peer = room.peers.get(peerId);
      if (!peer) {
        throw new Error(`Peer ${peerId} not found in room ${roomId}`);
      }

      // Create transport with configured options
      const transport = await room.router.createWebRtcTransport({
        ...this.webRtcTransportOptions,
        appData: {
          roomId,
          peerId,
          type
        }
      });

      // Setup transport event handlers
      this.setupTransportEventHandlers(transport, roomId, peerId, type);

      // Store transport in peer
      const transportId = `${type}_${transport.id}`;
      peer.transports.set(transportId, transport);

      const params = {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters
      };

      this.logger.info('WebRTC transport created successfully', {
        roomId,
        peerId,
        type,
        transportId: transport.id
      });

      this.emit(TransportEvents.TRANSPORT_CREATED, {
        roomId,
        peerId,
        transportId: transport.id,
        type,
        transport
      });

      return { transport, params };
    } catch (error) {
      this.logger.error('Failed to create WebRTC transport', { 
        error, 
        roomId, 
        peerId, 
        type 
      });
      throw error;
    }
  }

  public async connectTransport(
    roomId: string,
    peerId: string,
    transportId: string,
    dtlsParameters: mediasoup.types.DtlsParameters
  ): Promise<void> {
    try {
      this.logger.info('Connecting transport', { roomId, peerId, transportId });

      const transport = this.getTransport(roomId, peerId, transportId);
      if (!transport) {
        throw new Error(`Transport ${transportId} not found`);
      }

      await transport.connect({ dtlsParameters });

      this.logger.info('Transport connected successfully', {
        roomId,
        peerId,
        transportId
      });

      this.emit(TransportEvents.TRANSPORT_CONNECTED, {
        roomId,
        peerId,
        transportId,
        transport
      });
    } catch (error) {
      this.logger.error('Failed to connect transport', {
        error,
        roomId,
        peerId,
        transportId
      });
      throw error;
    }
  }

  public async createProducer(
    roomId: string,
    peerId: string,
    transportId: string,
    rtpParameters: mediasoup.types.RtpParameters,
    kind: mediasoup.types.MediaKind,
    appData?: any
  ): Promise<mediasoup.types.Producer> {
    try {
      this.logger.info('Creating producer', {
        roomId,
        peerId,
        transportId,
        kind
      });

      const transport = this.getTransport(roomId, peerId, transportId);
      if (!transport || transport.constructor.name !== 'WebRtcTransport') {
        throw new Error(`WebRTC transport ${transportId} not found`);
      }

      const webRtcTransport = transport as mediasoup.types.WebRtcTransport;
      const producer = await webRtcTransport.produce({
        kind,
        rtpParameters,
        appData: {
          roomId,
          peerId,
          ...appData
        }
      });

      // Setup producer event handlers
      this.setupProducerEventHandlers(producer, roomId, peerId);

      // Store producer in peer
      const peer = this.roomManager.getPeer(roomId, peerId);
      if (peer) {
        peer.producers.set(producer.id, producer);
      }

      this.logger.info('Producer created successfully', {
        roomId,
        peerId,
        producerId: producer.id,
        kind
      });

      this.emit(TransportEvents.PRODUCER_CREATED, {
        roomId,
        peerId,
        producerId: producer.id,
        producer,
        kind
      });

      // Notify other peers about new producer
      this.notifyPeersAboutNewProducer(roomId, peerId, producer);

      return producer;
    } catch (error) {
      this.logger.error('Failed to create producer', {
        error,
        roomId,
        peerId,
        transportId,
        kind
      });
      throw error;
    }
  }

  public async createConsumer(
    roomId: string,
    peerId: string,
    transportId: string,
    producerId: string,
    rtpCapabilities: mediasoup.types.RtpCapabilities
  ): Promise<{
    consumer: mediasoup.types.Consumer;
    params: {
      id: string;
      producerId: string;
      kind: mediasoup.types.MediaKind;
      rtpParameters: mediasoup.types.RtpParameters;
    };
  }> {
    try {
      this.logger.info('Creating consumer', {
        roomId,
        peerId,
        transportId,
        producerId
      });

      const room = this.roomManager.getRoom(roomId);
      if (!room) {
        throw new Error(`Room ${roomId} not found`);
      }

      const transport = this.getTransport(roomId, peerId, transportId);
      if (!transport || transport.constructor.name !== 'WebRtcTransport') {
        throw new Error(`WebRTC transport ${transportId} not found`);
      }

      // Check if router can consume the producer
      if (!room.router.canConsume({ producerId, rtpCapabilities })) {
        throw new Error(`Cannot consume producer ${producerId}`);
      }

      const webRtcTransport = transport as mediasoup.types.WebRtcTransport;
      const consumer = await webRtcTransport.consume({
        producerId,
        rtpCapabilities,
        paused: true, // Start paused
        appData: {
          roomId,
          peerId,
          producerId
        }
      });

      // Setup consumer event handlers
      this.setupConsumerEventHandlers(consumer, roomId, peerId);

      // Store consumer in peer
      const peer = this.roomManager.getPeer(roomId, peerId);
      if (peer) {
        peer.consumers.set(consumer.id, consumer);
      }

      const params = {
        id: consumer.id,
        producerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters
      };

      this.logger.info('Consumer created successfully', {
        roomId,
        peerId,
        consumerId: consumer.id,
        producerId,
        kind: consumer.kind
      });

      this.emit(TransportEvents.CONSUMER_CREATED, {
        roomId,
        peerId,
        consumerId: consumer.id,
        consumer,
        producerId
      });

      return { consumer, params };
    } catch (error) {
      this.logger.error('Failed to create consumer', {
        error,
        roomId,
        peerId,
        transportId,
        producerId
      });
      throw error;
    }
  }

  public async resumeConsumer(
    roomId: string,
    peerId: string,
    consumerId: string
  ): Promise<void> {
    try {
      this.logger.info('Resuming consumer', { roomId, peerId, consumerId });

      const peer = this.roomManager.getPeer(roomId, peerId);
      if (!peer) {
        throw new Error(`Peer ${peerId} not found in room ${roomId}`);
      }

      const consumer = peer.consumers.get(consumerId);
      if (!consumer) {
        throw new Error(`Consumer ${consumerId} not found`);
      }

      await consumer.resume();

      this.logger.info('Consumer resumed successfully', {
        roomId,
        peerId,
        consumerId
      });

      this.emit(TransportEvents.CONSUMER_RESUMED, {
        roomId,
        peerId,
        consumerId,
        consumer
      });
    } catch (error) {
      this.logger.error('Failed to resume consumer', {
        error,
        roomId,
        peerId,
        consumerId
      });
      throw error;
    }
  }

  public async pauseConsumer(
    roomId: string,
    peerId: string,
    consumerId: string
  ): Promise<void> {
    try {
      this.logger.info('Pausing consumer', { roomId, peerId, consumerId });

      const peer = this.roomManager.getPeer(roomId, peerId);
      if (!peer) {
        throw new Error(`Peer ${peerId} not found in room ${roomId}`);
      }

      const consumer = peer.consumers.get(consumerId);
      if (!consumer) {
        throw new Error(`Consumer ${consumerId} not found`);
      }

      await consumer.pause();

      this.logger.info('Consumer paused successfully', {
        roomId,
        peerId,
        consumerId
      });

      this.emit(TransportEvents.CONSUMER_PAUSED, {
        roomId,
        peerId,
        consumerId,
        consumer
      });
    } catch (error) {
      this.logger.error('Failed to pause consumer', {
        error,
        roomId,
        peerId,
        consumerId
      });
      throw error;
    }
  }

  public async closeProducer(
    roomId: string,
    peerId: string,
    producerId: string
  ): Promise<void> {
    try {
      this.logger.info('Closing producer', { roomId, peerId, producerId });

      const peer = this.roomManager.getPeer(roomId, peerId);
      if (!peer) {
        throw new Error(`Peer ${peerId} not found in room ${roomId}`);
      }

      const producer = peer.producers.get(producerId);
      if (!producer) {
        throw new Error(`Producer ${producerId} not found`);
      }

      producer.close();
      peer.producers.delete(producerId);

      this.logger.info('Producer closed successfully', {
        roomId,
        peerId,
        producerId
      });

      this.emit(TransportEvents.PRODUCER_CLOSED, {
        roomId,
        peerId,
        producerId,
        producer
      });

      // Notify other peers about producer closure
      this.notifyPeersAboutProducerClosure(roomId, peerId, producerId);
    } catch (error) {
      this.logger.error('Failed to close producer', {
        error,
        roomId,
        peerId,
        producerId
      });
      throw error;
    }
  }

  public async closeConsumer(
    roomId: string,
    peerId: string,
    consumerId: string
  ): Promise<void> {
    try {
      this.logger.info('Closing consumer', { roomId, peerId, consumerId });

      const peer = this.roomManager.getPeer(roomId, peerId);
      if (!peer) {
        throw new Error(`Peer ${peerId} not found in room ${roomId}`);
      }

      const consumer = peer.consumers.get(consumerId);
      if (!consumer) {
        throw new Error(`Consumer ${consumerId} not found`);
      }

      consumer.close();
      peer.consumers.delete(consumerId);

      this.logger.info('Consumer closed successfully', {
        roomId,
        peerId,
        consumerId
      });

      this.emit(TransportEvents.CONSUMER_CLOSED, {
        roomId,
        peerId,
        consumerId,
        consumer
      });
    } catch (error) {
      this.logger.error('Failed to close consumer', {
        error,
        roomId,
        peerId,
        consumerId
      });
      throw error;
    }
  }

  public getTransport(
    roomId: string,
    peerId: string,
    transportId: string
  ): mediasoup.types.Transport | undefined {
    const peer = this.roomManager.getPeer(roomId, peerId);
    if (!peer) return undefined;

    // Try direct lookup first
    for (const [key, transport] of peer.transports) {
      if (transport.id === transportId || key.includes(transportId)) {
        return transport;
      }
    }

    return undefined;
  }

  public getTransportStats(
    roomId: string,
    peerId: string,
    transportId: string
  ): Promise<mediasoup.types.BaseTransportStats[]> | undefined {
    const transport = this.getTransport(roomId, peerId, transportId);
    return transport?.getStats() as Promise<mediasoup.types.BaseTransportStats[]>;
  }

  public async getProducerStats(
    roomId: string,
    peerId: string,
    producerId: string
  ): Promise<mediasoup.types.ProducerStat[]> {
    const peer = this.roomManager.getPeer(roomId, peerId);
    if (!peer) {
      throw new Error(`Peer ${peerId} not found in room ${roomId}`);
    }

    const producer = peer.producers.get(producerId);
    if (!producer) {
      throw new Error(`Producer ${producerId} not found`);
    }

    return producer.getStats();
  }

  public async getConsumerStats(
    roomId: string,
    peerId: string,
    consumerId: string
  ): Promise<mediasoup.types.ConsumerStat[]> {
    const peer = this.roomManager.getPeer(roomId, peerId);
    if (!peer) {
      throw new Error(`Peer ${peerId} not found in room ${roomId}`);
    }

    const consumer = peer.consumers.get(consumerId);
    if (!consumer) {
      throw new Error(`Consumer ${consumerId} not found`);
    }

    return consumer.getStats();
  }

  private setupTransportEventHandlers(
    transport: mediasoup.types.WebRtcTransport,
    roomId: string,
    peerId: string,
    type: TransportType
  ): void {
    transport.on('dtlsstatechange', (dtlsState) => {
      this.logger.debug('Transport DTLS state changed', {
        roomId,
        peerId,
        transportId: transport.id,
        dtlsState
      });

      if (dtlsState === 'failed' || dtlsState === 'closed') {
        this.logger.warn('Transport DTLS failed or closed', {
          roomId,
          peerId,
          transportId: transport.id,
          dtlsState
        });
      }
    });

    transport.on('icestatechange', (iceState) => {
      this.logger.debug('Transport ICE state changed', {
        roomId,
        peerId,
        transportId: transport.id,
        iceState
      });
    });

    transport.on('@close', () => {
      this.logger.info('Transport closed', {
        roomId,
        peerId,
        transportId: transport.id,
        type
      });
    });

    transport.on('@newproducer', (producer) => {
      this.logger.debug('New producer on transport', {
        roomId,
        peerId,
        transportId: transport.id,
        producerId: producer.id
      });
    });

  }

  private setupProducerEventHandlers(
    producer: mediasoup.types.Producer,
    roomId: string,
    peerId: string
  ): void {
    producer.on('transportclose', () => {
      this.logger.info('Producer transport closed', {
        roomId,
        peerId,
        producerId: producer.id
      });
    });

    producer.on('@close', () => {
      this.logger.info('Producer closed', {
        roomId,
        peerId,
        producerId: producer.id
      });
    });
  }

  private setupConsumerEventHandlers(
    consumer: mediasoup.types.Consumer,
    roomId: string,
    peerId: string
  ): void {
    consumer.on('transportclose', () => {
      this.logger.info('Consumer transport closed', {
        roomId,
        peerId,
        consumerId: consumer.id
      });
    });

    consumer.on('producerclose', () => {
      this.logger.info('Consumer producer closed', {
        roomId,
        peerId,
        consumerId: consumer.id
      });
    });

    consumer.on('@close', () => {
      this.logger.info('Consumer closed', {
        roomId,
        peerId,
        consumerId: consumer.id
      });
    });
  }

  private notifyPeersAboutNewProducer(
    roomId: string,
    producerPeerId: string,
    producer: mediasoup.types.Producer
  ): void {
    const otherPeers = this.roomManager.getOtherPeersInRoom(roomId, producerPeerId);
    
    this.emit(TransportEvents.NEW_PRODUCER_AVAILABLE, {
      roomId,
      producerPeerId,
      producerId: producer.id,
      kind: producer.kind,
      targetPeers: otherPeers.map(p => p.id)
    });
  }

  private notifyPeersAboutProducerClosure(
    roomId: string,
    producerPeerId: string,
    producerId: string
  ): void {
    const otherPeers = this.roomManager.getOtherPeersInRoom(roomId, producerPeerId);
    
    this.emit(TransportEvents.PRODUCER_CLOSED_NOTIFICATION, {
      roomId,
      producerPeerId,
      producerId,
      targetPeers: otherPeers.map(p => p.id)
    });
  }
}