<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
        <div class="flex items-center space-x-4">
          <span class="text-gray-700">{{ authStore.user?.name }}</span>
          <button @click="handleLogout" class="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Current Queue -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Currently Serving</h2>
        <div v-if="currentQueue" class="card bg-green-50 border-2 border-green-300">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-4xl font-bold text-green-600">
                {{ currentQueue.display_number }}
              </div>
              <p class="text-gray-700">{{ currentQueue.category.name }}</p>
            </div>
            <button
              @click="handleComplete(currentQueue.id)"
              class="btn btn-success btn-lg"
            >
              Complete
            </button>
          </div>
        </div>
        <div v-else class="card bg-gray-50 text-center text-gray-500">
          No queue being served
        </div>
      </div>

      <!-- Waiting Queues -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Waiting Queues</h2>
          <button @click="fetchQueues" class="btn btn-secondary">
            Refresh
          </button>
        </div>

        <!-- Filter by Category -->
        <div class="mb-4 flex space-x-2">
          <button
            @click="selectedCategory = null"
            :class="[
              'btn',
              selectedCategory === null ? 'btn-primary' : 'bg-gray-200 text-gray-700'
            ]"
          >
            All
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="[
              'btn',
              selectedCategory === category.id ? 'btn-primary' : 'bg-gray-200 text-gray-700'
            ]"
          >
            {{ category.name }}
          </button>
        </div>

        <div v-if="waitingQueues.length > 0" class="space-y-3">
          <div
            v-for="queue in waitingQueues"
            :key="queue.id"
            class="card flex justify-between items-center"
          >
            <div>
              <div class="text-2xl font-bold text-blue-600">
                {{ queue.display_number }}
              </div>
              <p class="text-sm text-gray-600">
                {{ queue.category.name }} - 
                {{ new Date(queue.created_at).toLocaleTimeString('id-ID') }}
              </p>
            </div>
            <div class="flex space-x-2">
              <button
                @click="handleCall(queue.id)"
                class="btn btn-primary"
                :disabled="!!currentQueue"
              >
                Call
              </button>
              <button
                @click="handleSkip(queue.id)"
                class="btn btn-danger"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
        <div v-else class="card text-center text-gray-500">
          No waiting queues
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useQueueStore, type Queue } from '@/stores/queue';
import { useWebSocket } from '@/composables/useWebSocket';

const router = useRouter();
const authStore = useAuthStore();
const queueStore = useQueueStore();
const { onQueueCreated, onQueueCalled, onQueueCompleted, onQueueUpdated } = useWebSocket();

const selectedCategory = ref<number | null>(null);
const currentQueue = ref<Queue | null>(null);

const categories = computed(() => queueStore.categories);
const waitingQueues = computed(() => {
  return queueStore.queues.filter(q => {
    if (selectedCategory.value && q.category_id !== selectedCategory.value) {
      return false;
    }
    return q.status === 'waiting';
  });
});

onMounted(async () => {
  await queueStore.fetchCategories();
  await fetchQueues();
  await queueStore.fetchCurrent();
  currentQueue.value = queueStore.currentQueue;

  // Listen to WebSocket events
  onQueueCreated(() => fetchQueues());
  onQueueCalled(() => {
    fetchQueues();
    updateCurrent();
  });
  onQueueCompleted(() => {
    fetchQueues();
    updateCurrent();
  });
  onQueueUpdated(() => fetchQueues());
});

async function fetchQueues() {
  await queueStore.fetchQueues();
}

async function updateCurrent() {
  await queueStore.fetchCurrent();
  currentQueue.value = queueStore.currentQueue;
}

async function handleCall(queueId: number) {
  await queueStore.callQueue(queueId);
  await fetchQueues();
  await updateCurrent();
}

async function handleComplete(queueId: number) {
  await queueStore.completeQueue(queueId);
  await fetchQueues();
  await updateCurrent();
}

async function handleSkip(queueId: number) {
  await queueStore.skipQueue(queueId);
  await fetchQueues();
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>
