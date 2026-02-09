import { ref, onMounted, onUnmounted } from 'vue';
import { io, Socket } from 'socket.io-client';
import type { Queue } from '@/stores/queue';

export function useWebSocket() {
  const socket = ref<Socket | null>(null);
  const connected = ref(false);

  function connect() {
    socket.value = io('http://localhost:3000', {
      transports: ['websocket'],
    });

    socket.value.on('connect', () => {
      connected.value = true;
      console.log('WebSocket connected');
    });

    socket.value.on('disconnect', () => {
      connected.value = false;
      console.log('WebSocket disconnected');
    });
  }

  function disconnect() {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
  }

  function onQueueCreated(callback: (queue: Queue) => void) {
    socket.value?.on('queue:created', callback);
  }

  function onQueueCalled(callback: (queue: Queue) => void) {
    socket.value?.on('queue:called', callback);
  }

  function onQueueCompleted(callback: (queue: Queue) => void) {
    socket.value?.on('queue:completed', callback);
  }

  function onQueueUpdated(callback: (queue: Queue) => void) {
    socket.value?.on('queue:updated', callback);
  }

  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    socket,
    connected,
    connect,
    disconnect,
    onQueueCreated,
    onQueueCalled,
    onQueueCompleted,
    onQueueUpdated,
  };
}
