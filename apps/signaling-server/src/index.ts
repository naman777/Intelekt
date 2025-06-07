// server/src/index.ts
import MediaSoupServer from "./server";

async function bootstrap() {
  const server = new MediaSoupServer();
  await server.start();
}

bootstrap().catch(console.error);