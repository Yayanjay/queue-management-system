import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Queue, QueueStatus } from './queue.entity';
import { CategoryService } from '../category/category.service';
import { QueueGateway } from './queue.gateway';

import { IsNumber } from 'class-validator';

export class CreateQueueDto {
  @IsNumber()
  category_id: number;
}

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
    @Inject(forwardRef(() => QueueGateway))
    private queueGateway: QueueGateway,
  ) {}

  async create(dto: CreateQueueDto): Promise<Queue> {
    const category = await this.categoryService.findById(dto.category_id);
    
    // Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find the highest number for this category today
    const lastQueue = await this.queueRepository.findOne({
      where: {
        category_id: dto.category_id,
        created_at: Between(startOfDay, endOfDay),
      },
      order: { number: 'DESC' },
    });

    const nextNumber = (lastQueue?.number || 0) + 1;
    const displayNumber = `${category.prefix}-${String(nextNumber).padStart(3, '0')}`;

    const queue = this.queueRepository.create({
      category_id: dto.category_id,
      number: nextNumber,
      display_number: displayNumber,
      status: QueueStatus.WAITING,
    });

    const savedQueue = await this.queueRepository.save(queue);
    const queueWithCategory = await this.findById(savedQueue.id);
    this.queueGateway.emitQueueCreated(queueWithCategory);
    return queueWithCategory;
  }

  async findAll(status?: QueueStatus, categoryId?: number): Promise<Queue[]> {
    const where: any = {};
    if (status) where.status = status;
    if (categoryId) where.category_id = categoryId;

    return this.queueRepository.find({
      where,
      relations: ['category'],
      order: { created_at: 'ASC' },
    });
  }

  async findToday(): Promise<Queue[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return this.queueRepository.find({
      where: {
        created_at: Between(startOfDay, endOfDay),
      },
      relations: ['category'],
      order: { created_at: 'ASC' },
    });
  }

  async findById(id: number): Promise<Queue> {
    const queue = await this.queueRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!queue) {
      throw new NotFoundException(`Queue with ID ${id} not found`);
    }
    return queue;
  }

  async getCurrent(): Promise<{
    current: Queue | null;
    next: Queue[];
  }> {
    const current = await this.queueRepository.findOne({
      where: [
        { status: QueueStatus.CALLING },
        { status: QueueStatus.SERVING },
      ],
      relations: ['category'],
      order: { called_at: 'DESC' },
    });

    const next = await this.queueRepository.find({
      where: { status: QueueStatus.WAITING },
      relations: ['category'],
      order: { created_at: 'ASC' },
      take: 5,
    });

    return { current, next };
  }

  async call(id: number, counterNumber?: number): Promise<Queue> {
    const queue = await this.findById(id);
    
    if (queue.status !== QueueStatus.WAITING) {
      throw new BadRequestException('Queue can only be called when in waiting status');
    }

    queue.status = QueueStatus.CALLING;
    queue.called_at = new Date();
    if (counterNumber) {
      queue.counter_number = counterNumber;
    }

    const savedQueue = await this.queueRepository.save(queue);
    this.queueGateway.emitQueueCalled(savedQueue);
    return savedQueue;
  }

  async serve(id: number): Promise<Queue> {
    const queue = await this.findById(id);
    
    if (queue.status !== QueueStatus.CALLING) {
      throw new BadRequestException('Queue must be in calling status to serve');
    }

    queue.status = QueueStatus.SERVING;
    const savedQueue = await this.queueRepository.save(queue);
    this.queueGateway.emitQueueUpdated(savedQueue);
    return savedQueue;
  }

  async complete(id: number): Promise<Queue> {
    const queue = await this.findById(id);
    
    if (![QueueStatus.CALLING, QueueStatus.SERVING].includes(queue.status)) {
      throw new BadRequestException('Queue must be in calling or serving status to complete');
    }

    queue.status = QueueStatus.COMPLETED;
    queue.completed_at = new Date();
    const savedQueue = await this.queueRepository.save(queue);
    this.queueGateway.emitQueueCompleted(savedQueue);
    return savedQueue;
  }

  async skip(id: number): Promise<Queue> {
    const queue = await this.findById(id);
    
    if (queue.status !== QueueStatus.WAITING) {
      throw new BadRequestException('Only waiting queues can be skipped');
    }

    queue.status = QueueStatus.SKIPPED;
    const savedQueue = await this.queueRepository.save(queue);
    this.queueGateway.emitQueueUpdated(savedQueue);
    return savedQueue;
  }

  async recall(id: number): Promise<Queue> {
    const queue = await this.findById(id);
    
    if (![QueueStatus.SKIPPED, QueueStatus.COMPLETED].includes(queue.status)) {
      throw new BadRequestException('Can only recall skipped or completed queues');
    }

    queue.status = QueueStatus.CALLING;
    queue.called_at = new Date();
    const savedQueue = await this.queueRepository.save(queue);
    this.queueGateway.emitQueueCalled(savedQueue);
    return savedQueue;
  }

  async reannounce(id: number): Promise<Queue> {
    const queue = await this.findById(id);
    
    if (![QueueStatus.CALLING, QueueStatus.SERVING].includes(queue.status)) {
      throw new BadRequestException('Can only reannounce queues that are calling or being served');
    }

    this.queueGateway.emitQueueReannounce(queue);
    return queue;
  }

  async resetAll(): Promise<void> {
    // Delete all queue records - resets the counter to 1 for all categories
    await this.queueRepository.delete({});
  }

  async deleteByCategoryId(categoryId: number): Promise<number> {
    const result = await this.queueRepository.delete({ category_id: categoryId });
    return result.affected || 0;
  }
}
