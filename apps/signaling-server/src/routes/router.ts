import express from 'express';
import { RoomController } from '../controllers/room';
import { WorkerController } from '../controllers/worker';
import { StatsController } from '../controllers/stats';

const router = express.Router();

// Room routes
router.get('/rooms', RoomController.getAllRooms);
router.get('/rooms/:roomId', RoomController.getRoom);
router.delete('/rooms/:roomId', RoomController.closeRoom);

// Worker routes
router.get('/workers', WorkerController.getWorkers);

// Stats routes
router.get('/stats', StatsController.getServerStats);

export default router;