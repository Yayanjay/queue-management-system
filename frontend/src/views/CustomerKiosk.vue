<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Theme Toggle -->
    <div class="fixed top-4 right-4 z-10">
      <ThemeToggle />
    </div>

    <div class="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-4">
          Queue Management System
        </h1>
        <p class="text-xl text-muted-foreground">
          Select a service to get your queue number
        </p>
      </div>

      <!-- Dynamic layout based on category count -->
      <div v-if="!selectedQueue" class="w-full max-w-5xl">
        <!-- 1 category: centered single card -->
        <div v-if="categories.length === 1" class="flex justify-center">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="handleSelectCategory(category)"
            class="card hover:border-accent hover:shadow-lg transition-all text-left p-8 cursor-pointer group w-full max-w-md"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-4">
                <div class="text-5xl font-bold text-accent group-hover:scale-110 transition-transform">
                  {{ category.prefix }}
                </div>
                <div>
                  <h2 class="text-2xl font-semibold mb-1">
                    {{ category.name }}
                  </h2>
                  <p class="text-sm text-muted-foreground">
                    {{ category.description }}
                  </p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </button>
        </div>

        <!-- 2 categories: side by side centered -->
        <div v-else-if="categories.length === 2" class="flex justify-center gap-6">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="handleSelectCategory(category)"
            class="card hover:border-accent hover:shadow-lg transition-all text-left p-8 cursor-pointer group w-full max-w-md"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-4">
                <div class="text-5xl font-bold text-accent group-hover:scale-110 transition-transform">
                  {{ category.prefix }}
                </div>
                <div>
                  <h2 class="text-2xl font-semibold mb-1">
                    {{ category.name }}
                  </h2>
                  <p class="text-sm text-muted-foreground">
                    {{ category.description }}
                  </p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </button>
        </div>

        <!-- 3 categories: 2 on top, 1 centered below -->
        <div v-else-if="categories.length === 3" class="flex flex-col items-center gap-6">
          <!-- Top row: 2 cards -->
          <div class="flex justify-center gap-6 w-full">
            <button
              v-for="category in categories.slice(0, 2)"
              :key="category.id"
              @click="handleSelectCategory(category)"
              class="card hover:border-accent hover:shadow-lg transition-all text-left p-8 cursor-pointer group w-full max-w-md"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-4">
                  <div class="text-5xl font-bold text-accent group-hover:scale-110 transition-transform">
                    {{ category.prefix }}
                  </div>
                  <div>
                    <h2 class="text-2xl font-semibold mb-1">
                      {{ category.name }}
                    </h2>
                    <p class="text-sm text-muted-foreground">
                      {{ category.description }}
                    </p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </button>
          </div>
          <!-- Bottom row: 1 card centered -->
          <div class="flex justify-center w-full" v-if="categories[2]">
            <button
              :key="categories[2].id"
              @click="handleSelectCategory(categories[2])"
              class="card hover:border-accent hover:shadow-lg transition-all text-left p-8 cursor-pointer group w-full max-w-md"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-4">
                  <div class="text-5xl font-bold text-accent group-hover:scale-110 transition-transform">
                    {{ categories[2].prefix }}
                  </div>
                  <div>
                    <h2 class="text-2xl font-semibold mb-1">
                      {{ categories[2].name }}
                    </h2>
                    <p class="text-sm text-muted-foreground">
                      {{ categories[2].description }}
                    </p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </button>
          </div>
        </div>

        <!-- 4+ categories: normal grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="handleSelectCategory(category)"
            class="card hover:border-accent hover:shadow-lg transition-all text-left p-8 cursor-pointer group"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-4">
                <div class="text-5xl font-bold text-accent group-hover:scale-110 transition-transform">
                  {{ category.prefix }}
                </div>
                <div>
                  <h2 class="text-2xl font-semibold mb-1">
                    {{ category.name }}
                  </h2>
                  <p class="text-sm text-muted-foreground">
                    {{ category.description }}
                  </p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </button>
        </div>
      </div>

      <div v-else class="max-w-2xl mx-auto">
        <div class="card text-center">
          <div class="card-header border-b">
            <h2 class="card-title text-2xl">Your Queue Number</h2>
          </div>
          
          <div class="card-content py-12">
            <div class="mb-8">
              <div class="text-8xl font-bold text-accent mb-4">
                {{ selectedQueue.display_number }}
              </div>
              <p class="text-xl text-muted-foreground mb-2">{{ selectedQueue.category.name }}</p>
              <p class="text-sm text-muted-foreground">
                {{ new Date(selectedQueue.created_at).toLocaleString('id-ID') }}
              </p>
            </div>

            <div class="separator my-8"></div>

            <div class="space-y-3">
              <button
                @click="handlePrint"
                class="w-full btn btn-primary btn-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect width="12" height="8" x="6" y="14"/>
                </svg>
                Print Ticket
              </button>
              <button
                @click="selectedQueue = null"
                class="w-full btn btn-outline btn-xl"
              >
                Get Another Ticket
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hidden print template -->
      <div v-if="selectedQueue" class="hidden print:block no-print">
        <div class="text-center p-8">
          <h2 class="text-3xl font-bold mb-6">Queue Ticket</h2>
          <div class="text-9xl font-bold my-12">
            {{ selectedQueue.display_number }}
          </div>
          <p class="text-2xl mb-3">{{ selectedQueue.category.name }}</p>
          <p class="text-lg mb-8">{{ new Date(selectedQueue.created_at).toLocaleString('id-ID') }}</p>
          <div class="separator my-8"></div>
          <p class="text-sm text-muted-foreground">
            Please wait for your number to be called<br />
            Silakan tunggu nomor Anda dipanggil
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQueueStore, type Category, type Queue } from '@/stores/queue';
import ThemeToggle from '@/components/ThemeToggle.vue';

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
    color: black;
  }
  
  .card, button, .no-print {
    display: none !important;
  }
}
</style>
