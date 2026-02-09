import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ length: 5 })
  prefix: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  created_at: Date;
}
