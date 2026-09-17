import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to database via Prisma.');
    } catch (error) {
      this.logger.warn(`Could not connect to database on startup: ${error.message}`);
      this.logger.warn('Running in offline/scaffolding mode until database is running.');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
