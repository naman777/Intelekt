import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Config } from "../config";
import { Logger } from "../utils/logger";
import { WorkerManager } from "../mediasoup/workerManager";
import { RoomManager } from "../mediasoup/roomManager";
import { TransportManager } from "../mediasoup/transportManager";
import { SocketHandler } from "../socket/index";
import { setupRoutes } from "../routes/index";
import dotenv from "dotenv";

dotenv.config();

export class MediaSoupServer {
  private app!: express.Application;
  private httpServer!: http.Server;
  private io!: Server;
  private config: Config;
  private logger: Logger;
  private workerManager!: WorkerManager;
  private roomManager!: RoomManager;
  private transportManager!: TransportManager;
  private socketHandler!: SocketHandler;
  private isInitialized: boolean = false;

  constructor() {
    this.logger = Logger.create("MediaSoupServer");
    this.config = Config.getInstance();

    this.setupExpress();
    this.setupSocketIO();
    this.setupManagers();
  }

  private setupExpress(): void {
    this.app = express();
    this.httpServer = http.createServer(this.app);

    // Middleware
    this.app.use(
      cors({
        origin: "*",
        credentials: true,
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Setup routes
    setupRoutes(this.app);
  }

  private setupSocketIO(): void {
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });
  }

  private setupManagers(): void {
    this.workerManager = WorkerManager.getInstance();
    this.roomManager = RoomManager.getInstance();
    this.transportManager = TransportManager.getInstance();
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn("Server already initialized");
      return;
    }

    try {
      this.logger.info("Initializing MediaSoup server...");

      // Validate configuration
      this.config.validateConfig();

      // Initialize workers
      const workerCount = parseInt(process.env.WORKER_COUNT || "1", 10);
      await this.workerManager.initialize(workerCount);

      // Initialize socket handler
      this.socketHandler = new SocketHandler(this.io);

      // Setup graceful shutdown
      this.setupGracefulShutdown();

      this.isInitialized = true;
      this.logger.info("MediaSoup server initialized successfully");
    } catch (error) {
      this.logger.error("Failed to initialize server", error as Error);
      throw error;
    }
  }

  public async start(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const port = this.config.getPort();

    return new Promise((resolve, reject) => {
      this.httpServer.listen(port, () => {
        this.logger.info(`MediaSoup server started on port ${port}`);
        this.logger.info(
          `Health check available at http://localhost:${port}/health`
        );
        this.logger.info(`API available at http://localhost:${port}/api`);
        resolve();
      });

      this.httpServer.on("error", (error) => {
        this.logger.error("Server failed to start", error);
        reject(error);
      });
    });
  }

  public async stop(): Promise<void> {
    try {
      this.logger.info("Stopping MediaSoup server...");

      // Close all rooms
      await this.roomManager.cleanup();

      // Close all workers
      await this.workerManager.closeAllWorkers();

      // Close HTTP server
      await new Promise<void>((resolve) => {
        this.httpServer.close(() => {
          this.logger.info("HTTP server closed");
          resolve();
        });
      });

      // Close Socket.IO
      this.io.close();

      this.logger.info("MediaSoup server stopped successfully");
    } catch (error) {
      this.logger.error("Error stopping server", error as Error);
      throw error;
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      this.logger.info(`Received ${signal}, shutting down gracefully...`);

      try {
        await this.stop();
        process.exit(0);
      } catch (error) {
        this.logger.error("Error during shutdown", error as Error);
        process.exit(1);
      }
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("uncaughtException", (error) => {
      this.logger.error("Uncaught exception", error);
      shutdown("uncaughtException");
    });

    process.on("unhandledRejection", (reason, promise) => {
      this.logger.error("Unhandled rejection", new Error(String(reason)));
      shutdown("unhandledRejection");
    });
  }

  public getApp(): express.Application {
    return this.app;
  }

  public getIO(): Server {
    return this.io;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const workerHealth = await this.workerManager.healthCheck();
      return workerHealth && this.isInitialized;
    } catch (error) {
      this.logger.error("Health check failed", error as Error);
      return false;
    }
  }
}

// Entry point
async function main() {
  try {
    const server = new MediaSoupServer();
    await server.start();
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start server if this file is run directly
if (require.main === module) {
  main();
}

export default MediaSoupServer;
