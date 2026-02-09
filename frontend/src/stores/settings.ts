import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';

export interface AppSettings {
  language: 'id' | 'en';
  announcement_template_id: string;
  announcement_template_en: string;
  display_next_count: number;
  auto_reset_daily: boolean;
  reset_time: string;
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings>({
    language: 'id',
    announcement_template_id: 'Nomor antrian {number}, silakan menuju loket',
    announcement_template_en: 'Queue number {number}, please proceed to the counter',
    display_next_count: 5,
    auto_reset_daily: true,
    reset_time: '00:00',
  });

  async function fetchSettings() {
    try {
      const response = await api.get('/settings');
      settings.value = response.data;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  }

  async function updateSettings(updates: Partial<AppSettings>) {
    try {
      await api.patch('/settings', updates);
      Object.assign(settings.value, updates);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  }

  return {
    settings,
    fetchSettings,
    updateSettings,
  };
});
