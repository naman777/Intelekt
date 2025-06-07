// server/src/config/index.ts
import * as mediasoup from 'mediasoup';
import { ServerConfig } from '../types';
import dotenv from 'dotenv';
dotenv.config();

export class Config {
  private static instance: Config;
  private config: ServerConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  private loadConfig(): ServerConfig {
    return {
      port: parseInt(process.env.PORT || '3000', 10),
      
      worker: {
        logLevel: (process.env.MEDIASOUP_LOG_LEVEL as mediasoup.types.WorkerLogLevel) || 'warn',
        logTags: [
          'info',
          'ice',
          'dtls',
          'rtp',
          'srtp',
          'rtcp',
          'rtx',
          'bwe',
          'score',
          'simulcast',
          'svc'
        ],
        rtcMinPort: parseInt(process.env.RTC_MIN_PORT || '10000', 10),
        rtcMaxPort: parseInt(process.env.RTC_MAX_PORT || '10100', 10),
      },

      webRtcTransport: {
        listenIps: [
          {
            ip: '0.0.0.0',
            announcedIp: process.env.ANNOUNCED_IP || '127.0.0.1',
          }
        ],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
        maxIncomingBitrate: 1500000,
        maxOutgoingBitrate: 600000,
      },

      room: {
        maxPeers: parseInt(process.env.MAX_PEERS || '20', 10),
        mediaCodecs: this.getMediaCodecs(),
      }
    };
  }

  private getMediaCodecs(): mediasoup.types.RtpCodecCapability[] {
    return [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
          'x-google-start-bitrate': 1000,
        },
      },
      {
        kind: 'video',
        mimeType: 'video/VP9',
        clockRate: 90000,
        parameters: {
          'profile-id': 2,
          'x-google-start-bitrate': 1000,
        },
      },
      {
        kind: 'video',
        mimeType: 'video/h264',
        clockRate: 90000,
        parameters: {
          'packetization-mode': 1,
          'profile-level-id': '4d0032',
          'level-asymmetry-allowed': 1,
          'x-google-start-bitrate': 1000,
        },
      },
      {
        kind: 'video',
        mimeType: 'video/h264',
        clockRate: 90000,
        parameters: {
          'packetization-mode': 1,
          'profile-level-id': '42e01f',
          'level-asymmetry-allowed': 1,
          'x-google-start-bitrate': 1000,
        },
      },
    ];
  }

  public get(): ServerConfig {
    return { ...this.config };
  }

  public getWorkerSettings() {
    return { ...this.config.worker };
  }

  public getWebRtcTransportOptions() {
    return { ...this.config.webRtcTransport };
  }

  public getRoomConfig() {
    return { ...this.config.room };
  }

  public getPort(): number {
    return this.config.port;
  }

  public updateConfig(partialConfig: Partial<ServerConfig>): void {
    this.config = { ...this.config, ...partialConfig };
  }

  public validateConfig(): boolean {
    const { port, worker, webRtcTransport, room } = this.config;

    // Validate port
    if (!port || port < 1 || port > 65535) {
      throw new Error('Invalid port number');
    }

    // Validate worker settings
    if (!worker.logLevel) {
      throw new Error('Worker log level is required');
    }

    // Validate WebRTC transport
    if (!webRtcTransport.listenIps || webRtcTransport.listenIps.length === 0) {
      throw new Error('At least one listen IP is required');
    }

    // Validate room config
    if (!room.maxPeers || room.maxPeers < 1) {
      throw new Error('Max peers must be at least 1');
    }

    if (!room.mediaCodecs || room.mediaCodecs.length === 0) {
      throw new Error('At least one media codec is required');
    }

    return true;
  }

  public isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  public isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }
}