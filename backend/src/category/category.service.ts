import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

export interface CreateCategoryDto {
  name: string;
  prefix: string;
  description?: string;
  order?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  prefix?: string;
  description?: string;
  is_active?: boolean;
  order?: number;
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
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

  async delete(id: number): Promise<void> {
    const category = await this.findById(id);
    await this.categoryRepository.remove(category);
  }
}
