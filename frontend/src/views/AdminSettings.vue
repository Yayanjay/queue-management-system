<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <div class="flex items-center space-x-4">
          <button @click="$router.push('/staff')" class="btn btn-secondary">
            Back to Dashboard
          </button>
          <button @click="handleLogout" class="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Categories Management -->
        <div class="card">
          <h2 class="text-xl font-semibold mb-4">Queue Categories</h2>
          
          <!-- Add Category Form -->
          <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="font-medium mb-3">Add New Category</h3>
            <form @submit.prevent="handleAddCategory" class="space-y-3">
              <input
                v-model="newCategory.name"
                type="text"
                placeholder="Category Name"
                class="w-full px-3 py-2 border rounded"
                required
              />
              <input
                v-model="newCategory.prefix"
                type="text"
                placeholder="Prefix (e.g., A, B, C)"
                maxlength="5"
                class="w-full px-3 py-2 border rounded"
                required
              />
              <input
                v-model="newCategory.description"
                type="text"
                placeholder="Description"
                class="w-full px-3 py-2 border rounded"
              />
              <button type="submit" class="btn btn-primary w-full">
                Add Category
              </button>
            </form>
          </div>

          <!-- Categories List -->
          <div class="space-y-3">
            <div
              v-for="category in categories"
              :key="category.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div>
                <span class="font-bold text-blue-600">{{ category.prefix }}</span>
                <span class="ml-2">{{ category.name }}</span>
                <p class="text-sm text-gray-600">{{ category.description }}</p>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="toggleCategory(category)"
                  :class="[
                    'btn text-sm',
                    category.is_active ? 'btn-secondary' : 'btn-success'
                  ]"
                >
                  {{ category.is_active ? 'Disable' : 'Enable' }}
                </button>
                <button
                  @click="deleteCategory(category.id)"
                  class="btn btn-danger text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- System Settings -->
        <div class="card">
          <h2 class="text-xl font-semibold mb-4">System Settings</h2>
          
          <form @submit.prevent="handleSaveSettings" class="space-y-4">
            <!-- Language -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Announcement Language
              </label>
              <select
                v-model="settings.language"
                class="w-full px-3 py-2 border rounded"
              >
                <option value="id">Indonesian</option>
                <option value="en">English</option>
              </select>
            </div>

            <!-- Indonesian Template -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Indonesian Announcement Template
              </label>
              <input
                v-model="settings.announcement_template_id"
                type="text"
                class="w-full px-3 py-2 border rounded"
                placeholder="Use {number} for queue number"
              />
              <p class="text-xs text-gray-500 mt-1">
                Use {'{number}'} as placeholder for queue number
              </p>
            </div>

            <!-- English Template -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                English Announcement Template
              </label>
              <input
                v-model="settings.announcement_template_en"
                type="text"
                class="w-full px-3 py-2 border rounded"
                placeholder="Use {number} for queue number"
              />
            </div>

            <!-- Display Next Count -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Number of Next Queues to Display
              </label>
              <input
                v-model.number="settings.display_next_count"
                type="number"
                min="3"
                max="10"
                class="w-full px-3 py-2 border rounded"
              />
            </div>

            <button type="submit" class="btn btn-primary w-full">
              Save Settings
            </button>
          </form>

          <!-- Danger Zone -->
          <div class="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 class="font-medium text-red-800 mb-2">Danger Zone</h3>
            <button
              @click="handleResetQueues"
              class="btn btn-danger w-full"
            >
              Reset All Queues
            </button>
            <p class="text-xs text-red-600 mt-2">
              This will delete all queue records. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useQueueStore, type Category } from '@/stores/queue';
import { useSettingsStore, type AppSettings } from '@/stores/settings';
import api from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();
const queueStore = useQueueStore();
const settingsStore = useSettingsStore();

const categories = ref<Category[]>([]);
const settings = ref<AppSettings>({ ...settingsStore.settings });

const newCategory = ref({
  name: '',
  prefix: '',
  description: '',
});

onMounted(async () => {
  await loadData();
});

async function loadData() {
  await queueStore.fetchCategories();
  const response = await api.get('/categories/all');
  categories.value = response.data;
  
  await settingsStore.fetchSettings();
  settings.value = { ...settingsStore.settings };
}

async function handleAddCategory() {
  try {
    await api.post('/categories', newCategory.value);
    newCategory.value = { name: '', prefix: '', description: '' };
    await loadData();
  } catch (error) {
    alert('Failed to add category');
  }
}

async function toggleCategory(category: Category) {
  try {
    await api.patch(`/categories/${category.id}`, {
      is_active: !category.is_active,
    });
    await loadData();
  } catch (error) {
    alert('Failed to update category');
  }
}

async function deleteCategory(id: number) {
  if (!confirm('Are you sure you want to delete this category?')) {
    return;
  }
  
  try {
    await api.delete(`/categories/${id}`);
    await loadData();
  } catch (error) {
    alert('Failed to delete category');
  }
}

async function handleSaveSettings() {
  try {
    await settingsStore.updateSettings(settings.value);
    alert('Settings saved successfully');
  } catch (error) {
    alert('Failed to save settings');
  }
}

async function handleResetQueues() {
  if (!confirm('Are you sure you want to reset all queues? This cannot be undone!')) {
    return;
  }
  
  try {
    await api.post('/queues/reset');
    alert('All queues have been reset');
  } catch (error) {
    alert('Failed to reset queues');
  }
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>
