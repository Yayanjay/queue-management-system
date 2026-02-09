<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-5xl font-bold text-center text-white mb-12">
        Pilih Layanan / Select Service
      </h1>

      <div v-if="!selectedQueue" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="handleSelectCategory(category)"
          class="card hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer text-center py-12"
        >
          <div class="text-6xl font-bold text-blue-600 mb-4">
            {{ category.prefix }}
          </div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">
            {{ category.name }}
          </h2>
          <p class="text-gray-600">
            {{ category.description }}
          </p>
        </button>
      </div>

      <div v-else class="card text-center">
        <div class="mb-8">
          <div class="text-8xl font-bold text-blue-600 mb-4">
            {{ selectedQueue.display_number }}
          </div>
          <p class="text-2xl text-gray-700 mb-2">{{ selectedQueue.category.name }}</p>
          <p class="text-gray-600">
            {{ new Date(selectedQueue.created_at).toLocaleString('id-ID') }}
          </p>
        </div>

        <div class="space-y-4">
          <button
            @click="handlePrint"
            class="w-full btn btn-primary btn-lg"
          >
            Print Ticket / Cetak Tiket
          </button>
          <button
            @click="selectedQueue = null"
            class="w-full btn btn-secondary btn-lg"
          >
            Get Another Ticket / Ambil Tiket Lain
          </button>
        </div>
      </div>

      <!-- Hidden print template -->
      <div v-if="selectedQueue" class="hidden print:block">
        <div class="text-center p-8">
          <h2 class="text-3xl font-bold mb-4">Queue Ticket / Tiket Antrian</h2>
          <div class="text-9xl font-bold my-8">
            {{ selectedQueue.display_number }}
          </div>
          <p class="text-xl mb-2">{{ selectedQueue.category.name }}</p>
          <p class="text-lg">{{ new Date(selectedQueue.created_at).toLocaleString('id-ID') }}</p>
          <p class="text-sm mt-8 text-gray-600">Thank you / Terima kasih</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQueueStore, type Category, type Queue } from '@/stores/queue';

const queueStore = useQueueStore();
const categories = ref<Category[]>([]);
const selectedQueue = ref<Queue | null>(null);

onMounted(async () => {
  await queueStore.fetchCategories();
  categories.value = queueStore.categories;
});

async function handleSelectCategory(category: Category) {
  const queue = await queueStore.createQueue(category.id);
  if (queue) {
    selectedQueue.value = queue;
  }
}

function handlePrint() {
  window.print();
}
</script>

<style scoped>
@media print {
  body {
    background: white;
  }
  
  .card, button {
    display: none !important;
  }
}
</style>
