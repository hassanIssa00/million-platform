import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { winstonConfig } from './config/logger.config';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

async function bootstrap() {
  // Create app with Winston logger
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: winstonConfig,
  });

  const logger = new Logger('Bootstrap');

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Serve static files from uploads directory
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Add global prefix /api
  app.setGlobalPrefix('api');

  // Setup Swagger documentation
  if (
    process.env.NODE_ENV !== 'production' ||
    process.env.ENABLE_API_DOCS === 'true'
  ) {
    setupSwagger(app);
    logger.log('📚 Swagger documentation available at /api/docs');
  }

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
  logger.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap().catch((err) => {
  new Logger('Bootstrap').error(err);
});
