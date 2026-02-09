import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './settings.entity';

export interface AppSettings {
  language: 'id' | 'en';
  announcement_template_id: string;
  announcement_template_en: string;
  display_next_count: number;
  auto_reset_daily: boolean;
  reset_time: string;
}

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
  ) {}

  async get(key: string): Promise<string | null> {
    const setting = await this.settingsRepository.findOne({ where: { key } });
    return setting?.value || null;
  }

  async set(key: string, value: string): Promise<void> {
    const existing = await this.settingsRepository.findOne({ where: { key } });
    if (existing) {
      existing.value = value;
      await this.settingsRepository.save(existing);
    } else {
      const setting = this.settingsRepository.create({ key, value });
      await this.settingsRepository.save(setting);
    }
  }

  async getAll(): Promise<AppSettings> {
    const settings = await this.settingsRepository.find();
    const result: any = {
      language: 'id',
      announcement_template_id: 'Nomor antrian {number}, silakan menuju loket',
      announcement_template_en: 'Queue number {number}, please proceed to the counter',
      display_next_count: 5,
      auto_reset_daily: true,
      reset_time: '00:00',
    };

    settings.forEach(s => {
      try {
        result[s.key] = JSON.parse(s.value);
      } catch {
        result[s.key] = s.value;
      }
    });

    return result;
  }

  async updateSettings(updates: Partial<AppSettings>): Promise<void> {
    for (const [key, value] of Object.entries(updates)) {
      await this.set(key, JSON.stringify(value));
    }
  }

  async initializeDefaults(): Promise<void> {
    const defaults: AppSettings = {
      language: 'id',
      announcement_template_id: 'Nomor antrian {number}, silakan menuju loket',
      announcement_template_en: 'Queue number {number}, please proceed to the counter',
      display_next_count: 5,
      auto_reset_daily: true,
      reset_time: '00:00',
    };

    for (const [key, value] of Object.entries(defaults)) {
      const existing = await this.get(key);
      if (!existing) {
        await this.set(key, JSON.stringify(value));
      }
    }
  }
}
