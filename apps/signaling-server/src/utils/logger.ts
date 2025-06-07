// server/src/utils/logger.ts
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: string;
  metadata?: Record<string, any>;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private context?: string;

  private constructor(context?: string) {
    this.logLevel = this.getLogLevelFromEnv();
    this.context = context;
  }

  public static getInstance(context?: string): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(context);
    }
    return Logger.instance;
  }

  public static create(context: string): Logger {
    return new Logger(context);
  }

  private getLogLevelFromEnv(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toUpperCase();
    switch (envLevel) {
      case 'ERROR':
        return LogLevel.ERROR;
      case 'WARN':
        return LogLevel.WARN;
      case 'INFO':
        return LogLevel.INFO;
      case 'DEBUG':
        return LogLevel.DEBUG;
      default:
        return LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private formatMessage(level: LogLevel, message: string, metadata?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const levelStr = LogLevel[level];
    const contextStr = this.context ? `[${this.context}]` : '';
    const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
    
    return `${timestamp} ${levelStr} ${contextStr} ${message}${metadataStr}`;
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message, metadata);

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
    }
  }

  public error(message: string, error?: Error | Record<string, any>): void {
    const metadata = error instanceof Error 
      ? { error: error.message, stack: error.stack }
      : error;
    this.log(LogLevel.ERROR, message, metadata);
  }

  public warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  public info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  public debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public setContext(context: string): void {
    this.context = context;
  }

  // Utility methods for common logging scenarios
  public logTransportCreated(transportId: string, peerId: string, type: 'producer' | 'consumer'): void {
    this.info('Transport created', {
      transportId,
      peerId,
      type,
      action: 'transport_created'
    });
  }

  public logProducerCreated(producerId: string, peerId: string, kind: string): void {
    this.info('Producer created', {
      producerId,
      peerId,
      kind,
      action: 'producer_created'
    });
  }

  public logConsumerCreated(consumerId: string, producerId: string, peerId: string, kind: string): void {
    this.info('Consumer created', {
      consumerId,
      producerId,
      peerId,
      kind,
      action: 'consumer_created'
    });
  }

  public logPeerJoined(peerId: string, roomId: string, displayName?: string): void {
    this.info('Peer joined room', {
      peerId,
      roomId,
      displayName,
      action: 'peer_joined'
    });
  }

  public logPeerLeft(peerId: string, roomId: string): void {
    this.info('Peer left room', {
      peerId,
      roomId,
      action: 'peer_left'
    });
  }

  public logRoomCreated(roomId: string): void {
    this.info('Room created', {
      roomId,
      action: 'room_created'
    });
  }

  public logRoomClosed(roomId: string, reason?: string): void {
    this.info('Room closed', {
      roomId,
      reason,
      action: 'room_closed'
    });
  }

  public logWorkerDied(workerId?: string): void {
    this.error('MediaSoup worker died', {
      workerId,
      action: 'worker_died'
    });
  }

  public logServerStarted(port: number): void {
    this.info('Server started successfully', {
      port,
      action: 'server_started'
    });
  }

  public logServerError(error: Error): void {
    this.error('Server error', error);
  }
}