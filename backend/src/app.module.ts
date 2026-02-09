import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { QueueModule } from './queue/queue.module';
import { SettingsModule } from './settings/settings.module';
import { User } from './user/user.entity';
import { Category } from './category/category.entity';
import { Queue } from './queue/queue.entity';
import { Settings } from './settings/settings.entity';
import { UserService } from './user/user.service';
import { CategoryService } from './category/category.service';
import { SettingsService } from './settings/settings.service';
import { UserRole } from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Category, Queue, Settings],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    QueueModule,
    SettingsModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private settingsService: SettingsService,
  ) {}

  async onModuleInit() {
    // Initialize default admin user
    const adminExists = await this.userService.findByUsername('admin');
    if (!adminExists) {
      await this.userService.create('admin', 'admin123', 'Administrator', UserRole.ADMIN);
      console.log('Default admin user created - username: admin, password: admin123');
    }

    // Initialize default categories
    const categories = await this.categoryService.findAll();
    if (categories.length === 0) {
      await this.categoryService.create({
        name: 'Umum',
        prefix: 'A',
        description: 'Layanan Umum / General Service',
        order: 1,
      });
      await this.categoryService.create({
        name: 'Prioritas',
        prefix: 'B',
        description: 'Layanan Prioritas / Priority Service',
        order: 2,
      });
      await this.categoryService.create({
        name: 'Khusus',
        prefix: 'C',
        description: 'Layanan Khusus / Special Service',
        order: 3,
      });
      console.log('Default categories created');
    }

    // Initialize default settings
    await this.settingsService.initializeDefaults();
    console.log('Default settings initialized');
  }
}
