import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix: /api/v1
  app.setGlobalPrefix('api/v1');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger OpenAPI documentation setup
  const config = new DocumentBuilder()
    .setTitle('Primary School Semi-Boarding Meal Management API')
    .setDescription('3-Tier Modular REST API for Meal Demand, Nutrition, Catering, and Billing')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend server running on http://localhost:${port}/api/v1`);
  console.log(`Swagger documentation available at http://localhost:${port}/docs`);
}
bootstrap();
