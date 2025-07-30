import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Use Socket.IO adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3001);
  console.log('Cricket Scoring App Backend running on port 3001');
}
bootstrap(); 