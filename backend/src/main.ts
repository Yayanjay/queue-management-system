import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`\n🚀 Queue Management System Backend`);
  console.log(`📡 Server running on: http://localhost:${port}`);
  console.log(`🔌 WebSocket available on: ws://localhost:${port}\n`);
}

bootstrap();
