import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './queue.entity';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { QueueGateway } from './queue.gateway';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Queue]), CategoryModule],
  providers: [QueueService, QueueGateway],
  controllers: [QueueController],
  exports: [QueueService, QueueGateway],
})
export class QueueModule {}
