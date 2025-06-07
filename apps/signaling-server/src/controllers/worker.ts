import { Request, Response } from 'express';
import { WorkerManager } from '../mediasoup/workerManager';
import { Logger } from '../utils/logger';

export class WorkerController {
  private static logger = Logger.create('WorkerController');
  private static workerManager = WorkerManager.getInstance();

  public static async getWorkers(req: Request, res: Response): Promise<void> {
    try {
      const workers = this.workerManager.getWorkerStats();
      const usage = await this.workerManager.getWorkerResourceUsage();
      
      res.json({ 
        success: true, 
        data: { 
          workers, 
          usage,
          count: this.workerManager.getWorkerCount()
        } 
      });
    } catch (error) {
      this.logger.error('Failed to get workers', error as Error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }
}