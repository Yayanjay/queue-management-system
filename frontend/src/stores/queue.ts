import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';

export interface Category {
  id: number;
  name: string;
  prefix: string;
  description: string;
  is_active: boolean;
  order: number;
}

export interface Queue {
  id: number;
  number: number;
  display_number: string;
  category_id: number;
  category: Category;
  status: 'waiting' | 'calling' | 'serving' | 'completed' | 'skipped';
  called_at: string | null;
  completed_at: string | null;
  counter_number: number | null;
  created_at: string;
}

export const useQueueStore = defineStore('queue', () => {
  const categories = ref<Category[]>([]);
  const queues = ref<Queue[]>([]);
  const currentQueue = ref<Queue | null>(null);
  const nextQueues = ref<Queue[]>([]);

  async function fetchCategories() {
    try {
      const response = await api.get('/categories');
      categories.value = response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }

  async function createQueue(categoryId: number): Promise<Queue | null> {
    try {
      const response = await api.post('/queues', { category_id: categoryId });
      return response.data;
    } catch (error) {
      console.error('Failed to create queue:', error);
      return null;
    }
  }

  async function fetchQueues(status?: string, categoryId?: number) {
    try {
      const params: any = {};
      if (status) params.status = status;
      if (categoryId) params.category_id = categoryId;
      
      const response = await api.get('/queues', { params });
      queues.value = response.data;
    } catch (error) {
      console.error('Failed to fetch queues:', error);
    }
  }

  async function fetchCurrent() {
    try {
      const response = await api.get('/queues/current');
      currentQueue.value = response.data.current;
      nextQueues.value = response.data.next;
    } catch (error) {
      console.error('Failed to fetch current queue:', error);
    }
  }

  async function callQueue(queueId: number, counterNumber?: number) {
    try {
      const response = await api.post(`/queues/${queueId}/call`, { counter_number: counterNumber });
      return response.data;
    } catch (error) {
      console.error('Failed to call queue:', error);
      return null;
    }
  }

  async function completeQueue(queueId: number) {
    try {
      const response = await api.post(`/queues/${queueId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Failed to complete queue:', error);
      return null;
    }
  }

  async function skipQueue(queueId: number) {
    try {
      const response = await api.post(`/queues/${queueId}/skip`);
      return response.data;
    } catch (error) {
      console.error('Failed to skip queue:', error);
      return null;
    }
  }

  async function recallQueue(queueId: number) {
    try {
      const response = await api.post(`/queues/${queueId}/recall`);
      return response.data;
    } catch (error) {
      console.error('Failed to recall queue:', error);
      return null;
    }
  }

  async function reannounceQueue(queueId: number) {
    try {
      const response = await api.post(`/queues/${queueId}/reannounce`);
      return response.data;
    } catch (error) {
      console.error('Failed to reannounce queue:', error);
      return null;
    }
  }

  return {
    categories,
    queues,
    currentQueue,
    nextQueues,
    fetchCategories,
    createQueue,
    fetchQueues,
    fetchCurrent,
    callQueue,
    completeQueue,
    skipQueue,
    recallQueue,
    reannounceQueue,
  };
});
