import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { QueueService } from '../queue/queue.service';

import { IsString, IsOptional, IsNumber, IsBoolean, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 5)
  prefix: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @IsString()
  @IsOptional()
  @Length(1, 5)
  prefix?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @Inject(forwardRef(() => QueueService))
    private queueService: QueueService,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { is_active: true },
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findAllIncludingInactive(): Promise<Category[]> {
    return this.categoryRepository.find({
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findById(id);
    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async delete(id: number): Promise<{ deletedQueues: number }> {
    const category = await this.findById(id);
    
    // Check if category is disabled
    if (category.is_active) {
      throw new BadRequestException('Can only delete disabled categories. Please disable the category first.');
    }
    
    // Delete all associated queues first
    const deletedQueues = await this.queueService.deleteByCategoryId(id);
    
    // Then delete the category
    await this.categoryRepository.remove(category);
    
    return { deletedQueues };
  }
}
