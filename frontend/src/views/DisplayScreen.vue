<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-8">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-6xl font-bold mb-4">Queue Management System</h1>
      <p class="text-3xl">{{ currentTime }}</p>
    </div>

    <!-- Current Queue -->
    <div class="mb-16">
      <h2 class="text-4xl font-semibold text-center mb-8 opacity-80">Now Serving / Sedang Dilayani</h2>
      <div v-if="currentQueue" class="bg-white/10 backdrop-blur-lg rounded-3xl p-16 text-center animate-pulse-slow">
        <div class="text-9xl font-bold mb-4 text-yellow-300">
          {{ currentQueue.display_number }}
        </div>
        <p class="text-4xl opacity-90">{{ currentQueue.category.name }}</p>
      </div>
      <div v-else class="bg-white/5 backdrop-blur-lg rounded-3xl p-16 text-center">
        <p class="text-5xl opacity-50">-</p>
      </div>
    </div>

    <!-- Next Queues -->
    <div>
      <h2 class="text-3xl font-semibold text-center mb-8 opacity-80">Next in Line / Selanjutnya</h2>
      <div class="grid grid-cols-5 gap-6">
        <div
          v-for="(queue, index) in displayNextQueues"
          :key="index"
          class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
        >
          <div class="text-4xl font-bold mb-2">
            {{ queue?.display_number || '-' }}
          </div>
          <p class="text-lg opacity-75">{{ queue?.category?.name || '' }}</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="fixed bottom-8 right-8">
      <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-lg px-4 py-2">
        <div
          :class="[
            'w-3 h-3 rounded-full',
            wsConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
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
const { connected: wsConnected, onQueueCalled, onQueueUpdated } = useWebSocket();
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

<style scoped>
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}
</style>
