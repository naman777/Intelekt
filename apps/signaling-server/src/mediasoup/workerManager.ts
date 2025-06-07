// server/src/mediasoup/WorkerManager.ts
import * as mediasoup from 'mediasoup';
import { Config } from '../config';
import { Logger } from '../utils/logger';
import { WorkerSettings } from '../types';

export class WorkerManager {
  private static instance: WorkerManager;
  private workers: Map<string, mediasoup.types.Worker> = new Map();
  private currentWorkerIndex: number = 0;
  private readonly logger: Logger;
  private readonly config: Config;
  private isInitialized: boolean = false;

  private constructor() {
    this.logger = Logger.create('WorkerManager');
    this.config = Config.getInstance();
  }

  public static getInstance(): WorkerManager {
    if (!WorkerManager.instance) {
      WorkerManager.instance = new WorkerManager();
    }
    return WorkerManager.instance;
  }

  public async initialize(workerCount: number = 1): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('WorkerManager already initialized');
      return;
    }

    try {
      this.logger.info('Initializing MediaSoup workers', { workerCount });
      
      const workerSettings = this.config.getWorkerSettings();
      const promises = [];

      for (let i = 0; i < workerCount; i++) {
        promises.push(this.createWorker(i, workerSettings));
      }

      await Promise.all(promises);
      
      this.isInitialized = true;
      this.logger.info('All MediaSoup workers initialized successfully', { 
        totalWorkers: this.workers.size 
      });
    } catch (error) {
      this.logger.error('Failed to initialize MediaSoup workers', error as Error);
      throw error;
    }
  }

  private async createWorker(index: number, settings: WorkerSettings): Promise<mediasoup.types.Worker> {
    try {
      const worker = await mediasoup.createWorker({
        logLevel: settings.logLevel,
        logTags: settings.logTags,
        rtcMinPort: settings.rtcMinPort,
        rtcMaxPort: settings.rtcMaxPort,
      });

      const workerId = `worker_${index}`;
      
      // Handle worker events
      this.setupWorkerEventHandlers(worker, workerId);
      
      this.workers.set(workerId, worker);
      
      this.logger.info('MediaSoup worker created', {
        workerId,
        pid: worker.pid,
        index
      });

      return worker;
    } catch (error) {
      this.logger.error(`Failed to create worker ${index}`, error as Error);
      throw error;
    }
  }

  private setupWorkerEventHandlers(worker: mediasoup.types.Worker, workerId: string): void {
    worker.on('died', (error) => {
      this.logger.logWorkerDied(workerId);
      this.logger.error('MediaSoup worker died', error);
      
      // Remove the dead worker
      this.workers.delete(workerId);
      
      // Optionally restart the worker
      this.handleWorkerDeath(workerId, error);
    });

    worker.observer.on('close', () => {
      this.logger.info('MediaSoup worker closed', { workerId });
    });

    worker.observer.on('newrouter', (router) => {
      this.logger.debug('New router created', {
        workerId,
        routerId: router.id
      });
    });
  }

  private async handleWorkerDeath(workerId: string, error?: Error): Promise<void> {
    try {
      this.logger.info('Attempting to restart dead worker', { workerId });
      
      const workerSettings = this.config.getWorkerSettings();
      const newWorker = await mediasoup.createWorker({
        logLevel: workerSettings.logLevel,
        logTags: workerSettings.logTags,
        rtcMinPort: workerSettings.rtcMinPort,
        rtcMaxPort: workerSettings.rtcMaxPort,
      });

      this.setupWorkerEventHandlers(newWorker, workerId);
      this.workers.set(workerId, newWorker);
      
      this.logger.info('Worker restarted successfully', {
        workerId,
        newPid: newWorker.pid
      });
    } catch (restartError) {
      this.logger.error('Failed to restart worker', restartError as Error);
      
      // If we can't restart, we might need to exit the process
      if (this.workers.size === 0) {
        this.logger.error('No workers available, exiting process');
        process.exit(1);
      }
    }
  }

  public getWorker(): mediasoup.types.Worker {
    if (this.workers.size === 0) {
      throw new Error('No MediaSoup workers available');
    }

    // Round-robin worker selection
    const workerIds = Array.from(this.workers.keys());
    const workerId = workerIds[this.currentWorkerIndex % workerIds.length];
    this.currentWorkerIndex++;

    const worker = this.workers.get(workerId);
    if (!worker) {
      throw new Error(`Worker ${workerId} not found`);
    }

    return worker;
  }

  public getWorkerById(workerId: string): mediasoup.types.Worker | undefined {
    return this.workers.get(workerId);
  }

  public getAllWorkers(): mediasoup.types.Worker[] {
    return Array.from(this.workers.values());
  }

  public getWorkerCount(): number {
    return this.workers.size;
  }

  public getWorkerStats(): Array<{ id: string; pid: number; closed: boolean }> {
    return Array.from(this.workers.entries()).map(([id, worker]) => ({
      id,
      pid: worker.pid,
      closed: worker.closed
    }));
  }

  public async closeAllWorkers(): Promise<void> {
    try {
      this.logger.info('Closing all MediaSoup workers');
      
      const closePromises = Array.from(this.workers.values()).map(worker => {
        return new Promise<void>((resolve) => {
          if (worker.closed) {
            resolve();
            return;
          }
          
          worker.observer.once('close', () => resolve());
          worker.close();
        });
      });

      await Promise.all(closePromises);
      this.workers.clear();
      this.isInitialized = false;
      
      this.logger.info('All MediaSoup workers closed');
    } catch (error) {
      this.logger.error('Error closing workers', error as Error);
      throw error;
    }
  }

  public async getWorkerResourceUsage(): Promise<Array<{ id: string; usage: mediasoup.types.WorkerResourceUsage }>> {
    const results = [];
    
    for (const [id, worker] of this.workers.entries()) {
      try {
        const usage = await worker.getResourceUsage();
        results.push({ id, usage });
      } catch (error) {
        this.logger.error(`Failed to get resource usage for worker ${id}`, error as Error);
      }
    }
    
    return results;
  }

  public isWorkerHealthy(workerId: string): boolean {
    const worker = this.workers.get(workerId);
    return worker ? !worker.closed : false;
  }

  public async healthCheck(): Promise<boolean> {
    const healthyWorkers = Array.from(this.workers.values()).filter(worker => !worker.closed);
    const isHealthy = healthyWorkers.length > 0;
    
    if (!isHealthy) {
      this.logger.error('Health check failed: No healthy workers available');
    }
    
    return isHealthy;
  }
}