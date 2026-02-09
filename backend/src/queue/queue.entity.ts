import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../category/category.entity';

export enum QueueStatus {
  WAITING = 'waiting',
  CALLING = 'calling',
  SERVING = 'serving',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
}

@Entity('queues')
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column()
  display_number: string;

  @Column()
  category_id: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({
    type: 'text',
    default: QueueStatus.WAITING,
  })
  status: QueueStatus;

  @Column({ nullable: true, type: 'datetime' })
  called_at: Date;

  @Column({ nullable: true, type: 'datetime' })
  completed_at: Date;

  @Column({ nullable: true })
  counter_number: number;

  @CreateDateColumn()
  created_at: Date;
}
