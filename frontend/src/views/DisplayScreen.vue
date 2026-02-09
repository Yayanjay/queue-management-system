<template>
  <div class="min-h-screen bg-background p-8">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold mb-4">Queue Management System</h1>
      <p class="text-2xl text-muted-foreground">{{ currentTime }}</p>
    </div>

    <!-- Current Queue -->
    <div class="mb-16">
      <h2 class="text-3xl font-semibold text-center mb-8 text-muted-foreground">
        Now Serving / Sedang Dilayani
      </h2>
      <div v-if="currentQueue" class="card border-accent/50 bg-accent/5 text-center p-16 animate-pulse-subtle">
        <div class="text-9xl font-bold mb-6 text-accent">
          {{ currentQueue.display_number }}
        </div>
        <p class="text-3xl text-foreground">{{ currentQueue.category.name }}</p>
      </div>
      <div v-else class="card text-center p-16">
        <p class="text-6xl text-muted-foreground">-</p>
      </div>
    </div>

    <!-- Next Queues -->
    <div>
      <h2 class="text-2xl font-semibold text-center mb-8 text-muted-foreground">
        Next in Line / Selanjutnya
      </h2>
      <div class="grid grid-cols-5 gap-6">
        <div
          v-for="(queue, index) in displayNextQueues"
          :key="index"
          class="card text-center p-8"
        >
          <div class="text-3xl font-bold mb-2 text-foreground">
            {{ queue?.display_number || '-' }}
          </div>
          <p class="text-sm text-muted-foreground">{{ queue?.category?.name || '' }}</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="fixed bottom-8 right-8">
      <div class="flex items-center space-x-2 card px-4 py-2">
        <div
          :class="[
            'w-3 h-3 rounded-full',
            wsConnected ? 'bg-success animate-pulse' : 'bg-destructive'
          ]"
        ></div>
        <span class="text-sm">{{ wsConnected ? 'Connected' : 'Disconnected' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useQueueStore, type Queue } from '@/stores/queue';
import { useSettingsStore } from '@/stores/settings';
import { useWebSocket } from '@/composables/useWebSocket';
import { useSpeech } from '@/composables/useSpeech';

const queueStore = useQueueStore();
const settingsStore = useSettingsStore();
const { connected: wsConnected, onQueueCalled, onQueueUpdated, onQueueReannounce } = useWebSocket();
const { speak } = useSpeech();

const currentQueue = ref<Queue | null>(null);
const nextQueues = ref<Queue[]>([]);
const currentTime = ref('');

let timeInterval: ReturnType<typeof setInterval>;

const displayNextQueues = computed(() => {
  const count = settingsStore.settings.display_next_count || 5;
  const result = [...nextQueues.value];
  while (result.length < count) {
    result.push(null as any);
  }
  return result.slice(0, count);
});

onMounted(async () => {
  await settingsStore.fetchSettings();
  await updateDisplay();
  
  // Update time every second
  updateTime();
  timeInterval = setInterval(updateTime, 1000);

  // Listen to WebSocket events
  onQueueCalled((queue: Queue) => {
    currentQueue.value = queue;
    announceQueue(queue);
    updateDisplay();
  });

  onQueueUpdated(() => {
    updateDisplay();
  });

  onQueueReannounce((queue: Queue) => {
    announceQueue(queue);
  });

  // Refresh display every 5 seconds
  setInterval(updateDisplay, 5000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});

function updateTime() {
  const now = new Date();
  currentTime.value = now.toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

async function updateDisplay() {
  await queueStore.fetchCurrent();
  currentQueue.value = queueStore.currentQueue;
  nextQueues.value = queueStore.nextQueues;
}

function announceQueue(queue: Queue) {
  const settings = settingsStore.settings;
  const template = settings.language === 'id' 
    ? settings.announcement_template_id 
    : settings.announcement_template_en;
  
  const text = template.replace('{number}', queue.display_number);
  const lang = settings.language === 'id' ? 'id-ID' : 'en-US';
  
  speak(text, lang);
}
</script>
