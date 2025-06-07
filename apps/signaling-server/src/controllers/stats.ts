import { Request, Response } from 'express';
import { RoomManager } from '../mediasoup/roomManager';
import { WorkerManager } from '../mediasoup/workerManager';
import { Logger } from '../utils/logger';

export class StatsController {
  private static logger = Logger.create('StatsController');
  private static roomManager = RoomManager.getInstance();
  private static workerManager = WorkerManager.getInstance();

  public static async getServerStats(req: Request, res: Response): Promise<void> {
    try {
      const roomStats = this.roomManager.getAllRoomStats();
      const workerStats = this.workerManager.getWorkerStats();
      const workerUsage = await this.workerManager.getWorkerResourceUsage();

      res.json({
        success: true,
        data: {
          server: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            timestamp: new Date().toISOString()
          },
          rooms: {
            total: this.roomManager.getRoomCount(),
            active: this.roomManager.getActiveRoomCount(),
            details: roomStats
          },
          peers: {
            total: this.roomManager.getTotalPeerCount()
          },
          workers: {
            count: this.workerManager.getWorkerCount(),
            details: workerStats,
            usage: workerUsage
          }
        }
      });
    } catch (error) {
      this.logger.error('Failed to get stats', error as Error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  public static healthCheck(req: Request, res: Response): void {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      rooms: this.roomManager?.getRoomCount() || 0,
      peers: this.roomManager?.getTotalPeerCount() || 0
    });
  }
}