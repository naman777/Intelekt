import { Request, Response } from 'express';
import { RoomManager } from '../mediasoup/roomManager';
import { Logger } from '../utils/logger';

export class RoomController {
  private static logger = Logger.create('RoomController');
  private static roomManager = RoomManager.getInstance();

  public static getAllRooms(req: Request, res: Response): void {
    try {
      const rooms = this.roomManager.getAllRoomStats();
      res.json({ success: true, data: rooms });
    } catch (error) {
      this.logger.error('Failed to get rooms', error as Error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  public static getRoom(req: Request, res: Response): void {
    try {
      const { roomId } = req.params;
      const room = this.roomManager.getRoomStats(roomId);
      
      if (!room) {
        res.status(404).json({ success: false, error: 'Room not found' });
        return;
      }

      res.json({ success: true, data: room });
    } catch (error) {
      this.logger.error('Failed to get room', error as Error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  public static async closeRoom(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      await this.roomManager.closeRoom(roomId);
      res.json({ success: true });
    } catch (error) {
      this.logger.error('Failed to close room', error as Error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }
}