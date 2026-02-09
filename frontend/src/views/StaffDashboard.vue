<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b bg-card">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-semibold">Staff Dashboard</h1>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-muted-foreground">{{ authStore.user?.name }}</span>
          <ThemeToggle />
          <button 
            v-if="authStore.isAdmin"
            @click="$router.push('/admin')" 
            class="btn btn-outline btn-sm"
          >
            Settings
          </button>
          <button @click="handleLogout" class="btn btn-ghost btn-sm">
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Current Queue -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold mb-4">Currently Serving</h2>
        <div v-if="currentQueue" class="card border-accent/50 bg-accent/5">
          <div class="card-content pt-6">
            <div class="flex justify-between items-center">
              <div>
                <div class="flex items-center gap-3">
                  <div class="text-4xl font-bold text-accent">
                    {{ currentQueue.display_number }}
                  </div>
                  <span class="badge badge-serving">Serving</span>
                </div>
                <p class="text-sm text-muted-foreground mt-2">{{ currentQueue.category.name }}</p>
              </div>
              <button
                @click="handleComplete(currentQueue.id)"
                class="btn btn-accent btn-lg"
              >
                Complete Service
              </button>
            </div>
          </div>
        </div>
        <div v-else class="card">
          <div class="card-content pt-6 text-center text-muted-foreground">
            No queue currently being served
          </div>
        </div>
      </div>

      <!-- Waiting Queues -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Waiting Queues</h2>
          <button @click="fetchQueues" class="btn btn-outline btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
              <path d="M16 16h5v5"/>
            </svg>
            Refresh
          </button>
        </div>

        <!-- Filter by Category -->
        <div class="mb-4 flex flex-wrap gap-2">
          <button
            @click="selectedCategory = null"
            :class="[
              'btn btn-sm',
              selectedCategory === null ? 'btn-primary' : 'btn-outline'
            ]"
          >
            All Queues
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="[
              'btn btn-sm',
              selectedCategory === category.id ? 'btn-primary' : 'btn-outline'
            ]"
          >
            {{ category.name }}
          </button>
        </div>

        <div v-if="waitingQueues.length > 0" class="space-y-2">
          <div
            v-for="queue in waitingQueues"
            :key="queue.id"
            class="card hover:border-accent/50 transition-colors"
          >
            <div class="card-content pt-6">
              <div class="flex justify-between items-center">
                <div class="flex-1">
                  <div class="flex items-center gap-3">
                    <div class="text-2xl font-bold text-foreground">
                      {{ queue.display_number }}
                    </div>
                    <span class="badge badge-waiting">Waiting</span>
                  </div>
                  <p class="text-sm text-muted-foreground mt-1">
                    {{ queue.category.name }} • 
                    {{ new Date(queue.created_at).toLocaleTimeString('id-ID') }}
                  </p>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="handleCall(queue.id)"
                    class="btn btn-primary"
                    :disabled="!!currentQueue"
                  >
                    Call Queue
                  </button>
                  <button
                    @click="handleSkip(queue.id)"
                    class="btn btn-outline"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="card">
          <div class="card-content pt-6 text-center text-muted-foreground">
            <p>No waiting queues</p>
            <p class="text-xs mt-2">Customers can get tickets at the kiosk</p>
          </div>
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
import ThemeToggle from '@/components/ThemeToggle.vue';

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
