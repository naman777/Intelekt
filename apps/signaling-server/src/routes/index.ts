import express from 'express';
import apiRoutes from './router';
import { StatsController } from '../controllers/stats';

export function setupRoutes(app: express.Application): void {
  // Health check endpoint
  app.get('/health', StatsController.healthCheck);
  
  // API routes
  app.use('/api', apiRoutes);
}