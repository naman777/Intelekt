// server/src/types/index.ts
import * as mediasoup from 'mediasoup';
import { Socket } from 'socket.io';

export interface MediaCodecOptions {
  kind: 'audio' | 'video';
  mimeType: string;
  clockRate: number;
  channels?: number;
  parameters?: Record<string, any>;
}

export interface WebRtcTransportOptions {
  listenIps: Array<{
    ip: string;
    announcedIp?: string;
  }>;
  enableUdp: boolean;
  enableTcp: boolean;
  preferUdp: boolean;
  maxIncomingBitrate?: number;
  maxOutgoingBitrate?: number;
}

export interface WorkerSettings {
  logLevel: mediasoup.types.WorkerLogLevel;
  logTags: mediasoup.types.WorkerLogTag[];
  rtcMinPort?: number;
  rtcMaxPort?: number;
}

export interface RoomConfig {
  maxPeers: number;
  mediaCodecs: mediasoup.types.RtpCodecCapability[];
}

export interface PeerInfo {
  id: string;
  socket: Socket;
  roomId: string;
  displayName?: string;
  metadata?: Record<string, any>;
}

export interface TransportInfo {
  id: string;
  type: 'producer' | 'consumer';
  transport: mediasoup.types.WebRtcTransport;
  peerId: string;
}

export interface ProducerInfo {
  id: string;
  peerId: string;
  kind: mediasoup.types.MediaKind;
  producer: mediasoup.types.Producer;
  paused: boolean;
}

export interface ConsumerInfo {
  id: string;
  peerId: string;
  producerId: string;
  kind: mediasoup.types.MediaKind;
  consumer: mediasoup.types.Consumer;
  paused: boolean;
}

export interface SocketEvents {
  // Connection events
  'join-room': (data: { roomId: string; displayName?: string }) => void;
  'leave-room': () => void;
  
  // Transport events
  'create-webrtc-transport': (data: { type: 'producer' | 'consumer' }) => void;
  'connect-transport': (data: { transportId: string; dtlsParameters: mediasoup.types.DtlsParameters }) => void;
  
  // Producer events
  'produce': (data: { transportId: string; kind: mediasoup.types.MediaKind; rtpParameters: mediasoup.types.RtpParameters }) => void;
  'pause-producer': (data: { producerId: string }) => void;
  'resume-producer': (data: { producerId: string }) => void;
  'close-producer': (data: { producerId: string }) => void;
  
  // Consumer events
  'consume': (data: { transportId: string; producerId: string; rtpCapabilities: mediasoup.types.RtpCapabilities }) => void;
  'pause-consumer': (data: { consumerId: string }) => void;
  'resume-consumer': (data: { consumerId: string }) => void;
  'close-consumer': (data: { consumerId: string }) => void;
}

export interface SocketCallbacks {
  'router-rtp-capabilities': (rtpCapabilities: mediasoup.types.RtpCapabilities) => void;
  'transport-created': (params: {
    id: string;
    iceParameters: mediasoup.types.IceParameters;
    iceCandidates: mediasoup.types.IceCandidate[];
    dtlsParameters: mediasoup.types.DtlsParameters;
  }) => void;
  'producer-created': (data: { id: string }) => void;
  'consumer-created': (data: {
    id: string;
    producerId: string;
    kind: mediasoup.types.MediaKind;
    rtpParameters: mediasoup.types.RtpParameters;
  }) => void;
  'new-producer': (data: { peerId: string; producerId: string; kind: mediasoup.types.MediaKind }) => void;
  'producer-closed': (data: { peerId: string; producerId: string }) => void;
  'peer-joined': (data: { peerId: string; displayName?: string }) => void;
  'peer-left': (data: { peerId: string }) => void;
  'room-peers': (peers: Array<{ peerId: string; displayName?: string; producers: Array<{ id: string; kind: mediasoup.types.MediaKind }> }>) => void;
}

export interface ServerConfig {
  port: number;
  worker: WorkerSettings;
  webRtcTransport: WebRtcTransportOptions;
  room: RoomConfig;
}

export interface MediaSoupError extends Error {
  code?: string;
  type?: 'transport' | 'producer' | 'consumer' | 'router' | 'worker';
}

// Custom error classes
export class TransportError extends Error implements MediaSoupError {
  code?: string;
  type: 'transport' = 'transport';
  
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'TransportError';
    this.code = code;
  }
}

export class ProducerError extends Error implements MediaSoupError {
  code?: string;
  type: 'producer' = 'producer';
  
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'ProducerError';
    this.code = code;
  }
}

export class ConsumerError extends Error implements MediaSoupError {
  code?: string;
  type: 'consumer' = 'consumer';
  
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'ConsumerError';
    this.code = code;
  }
}

export class RoomError extends Error implements MediaSoupError {
  code?: string;
  type?: 'transport' | 'producer' | 'consumer' | 'router' | 'worker';
  
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'RoomError';
    this.code = code;
  }
}

// server/src/types/index.ts (add these to your existing types)

export interface Room {
  id: string;
  router: mediasoup.types.Router;
  peers: Map<string, Peer>;
  createdAt: Date;
  lastActivity: Date;
  maxPeers: number;
  isActive: boolean;
}

export interface Peer {
  id: string;
  roomId: string;
  info: PeerInfo;
  transports: Map<string, mediasoup.types.Transport>;
  producers: Map<string, mediasoup.types.Producer>;
  consumers: Map<string, mediasoup.types.Consumer>;
  joinedAt: Date;
  lastSeen: Date;
  isConnected: boolean;
}

export interface PeerInfo {
  name?: string;
  avatar?: string;
  metadata?: Record<string, any>;
}

export interface RoomStats {
  roomId: string;
  peerCount: number;
  connectedPeerCount: number;
  createdAt: Date;
  lastActivity: Date;
  routerId: string;
  isActive: boolean;
  totalProducers: number;
  totalConsumers: number;
  totalTransports: number;
}

export enum RoomEvents {
  ROOM_CREATED = 'room:created',
  ROOM_CLOSED = 'room:closed',
  PEER_JOINED = 'peer:joined',
  PEER_LEFT = 'peer:left',
  PEER_CONNECTION_CHANGED = 'peer:connection-changed'
}

export interface RoomEventData {
  roomId: string;
  peerId?: string;
  peer?: Peer;
  room?: Room;
  isConnected?: boolean;
}

// server/src/types/index.ts (add these to your existing types)

export enum TransportType {
  SEND = 'send',
  RECV = 'recv'
}

export interface TransportOptions {
  roomId: string;
  peerId: string;
  type: TransportType;
}

export enum TransportEvents {
  TRANSPORT_CREATED = 'transport:created',
  TRANSPORT_CONNECTED = 'transport:connected',
  TRANSPORT_CLOSED = 'transport:closed',
  PRODUCER_CREATED = 'producer:created',
  PRODUCER_CLOSED = 'producer:closed',
  CONSUMER_CREATED = 'consumer:created',
  CONSUMER_CLOSED = 'consumer:closed',
  CONSUMER_RESUMED = 'consumer:resumed',
  CONSUMER_PAUSED = 'consumer:paused',
  NEW_PRODUCER_AVAILABLE = 'producer:available',
  PRODUCER_CLOSED_NOTIFICATION = 'producer:closed-notification'
}

export interface TransportEventData {
  roomId: string;
  peerId: string;
  transportId?: string;
  transport?: mediasoup.types.Transport;
  type?: TransportType;
  producerId?: string;
  producer?: mediasoup.types.Producer;
  consumerId?: string;
  consumer?: mediasoup.types.Consumer;
  kind?: mediasoup.types.MediaKind;
  producerPeerId?: string;
  targetPeers?: string[];
}

export interface CreateTransportRequest {
  roomId: string;
  peerId: string;
  type: TransportType;
}

export interface ConnectTransportRequest {
  roomId: string;
  peerId: string;
  transportId: string;
  dtlsParameters: mediasoup.types.DtlsParameters;
}

export interface ProduceRequest {
  roomId: string;
  peerId: string;
  transportId: string;
  kind: mediasoup.types.MediaKind;
  rtpParameters: mediasoup.types.RtpParameters;
  appData?: any;
}

export interface ConsumeRequest {
  roomId: string;
  peerId: string;
  transportId: string;
  producerId: string;
  rtpCapabilities: mediasoup.types.RtpCapabilities;
}

export interface TransportStats {
  transportId: string;
  type: TransportType;
  dtlsState?: mediasoup.types.DtlsState;
  iceState?: mediasoup.types.IceState;
  producerCount: number;
  consumerCount: number;
}