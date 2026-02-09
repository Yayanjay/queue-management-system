<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b bg-card">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-semibold">Admin Settings</h1>
        <div class="flex items-center space-x-2">
          <ThemeToggle />
          <button @click="$router.push('/staff')" class="btn btn-outline btn-sm">
            Back to Dashboard
          </button>
          <button @click="handleLogout" class="btn btn-destructive btn-sm">
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Categories Management -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Queue Categories</h2>
            <p class="card-description">Manage service categories and prefixes</p>
          </div>
          
          <div class="card-content space-y-6">
            <!-- Add Category Form -->
            <div class="rounded-lg border bg-muted/50 p-4">
              <h3 class="font-medium mb-3 text-sm">Add New Category</h3>
              <form @submit.prevent="handleAddCategory" class="space-y-3">
                <div>
                  <input
                    v-model="newCategory.name"
                    type="text"
                    placeholder="Category Name"
                    class="input"
                    required
                  />
                </div>
                <div>
                  <input
                    v-model="newCategory.prefix"
                    type="text"
                    placeholder="Prefix (e.g., A, B, C)"
                    maxlength="5"
                    class="input"
                    required
                  />
                </div>
                <div>
                  <input
                    v-model="newCategory.description"
                    type="text"
                    placeholder="Description"
                    class="input"
                  />
                </div>
                <button type="submit" class="btn btn-primary w-full">
                  Add Category
                </button>
              </form>
            </div>

            <!-- Categories List -->
            <div class="space-y-2">
              <div
                v-for="category in categories"
                :key="category.id"
                class="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-accent">{{ category.prefix }}</span>
                    <span class="font-medium">{{ category.name }}</span>
                    <span v-if="!category.is_active" class="badge badge-outline text-xs">Disabled</span>
                  </div>
                  <p class="text-sm text-muted-foreground mt-1">{{ category.description }}</p>
                </div>
                <div class="flex space-x-1">
                  <button
                    @click="toggleCategory(category)"
                    :class="[
                      'btn btn-sm',
                      category.is_active ? 'btn-outline' : 'btn-secondary'
                    ]"
                  >
                    {{ category.is_active ? 'Disable' : 'Enable' }}
                  </button>
                  <button
                    @click="deleteCategory(category.id)"
                    class="btn btn-destructive btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Settings -->
        <div class="space-y-6">
          <!-- Settings Card -->
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">System Settings</h2>
              <p class="card-description">Configure announcements and display options</p>
            </div>
            
            <form @submit.prevent="handleSaveSettings" class="card-content space-y-4">
              <!-- Language -->
              <div class="space-y-2">
                <label class="label">
                  Announcement Language
                </label>
                <select
                  v-model="settings.language"
                  class="select"
                >
                  <option value="id">Indonesian</option>
                  <option value="en">English</option>
                </select>
              </div>

              <!-- Indonesian Template -->
              <div class="space-y-2">
                <label class="label">
                  Indonesian Announcement Template
                </label>
                <input
                  v-model="settings.announcement_template_id"
                  type="text"
                  class="input"
                  placeholder="Use {number} for queue number"
                />
                <p class="text-xs text-muted-foreground">
                  Use {'{number}'} as placeholder for queue number
                </p>
              </div>

              <!-- English Template -->
              <div class="space-y-2">
                <label class="label">
                  English Announcement Template
                </label>
                <input
                  v-model="settings.announcement_template_en"
                  type="text"
                  class="input"
                  placeholder="Use {number} for queue number"
                />
              </div>

              <!-- Display Next Count -->
              <div class="space-y-2">
                <label class="label">
                  Number of Next Queues to Display
                </label>
                <input
                  v-model.number="settings.display_next_count"
                  type="number"
                  min="3"
                  max="10"
                  class="input"
                />
              </div>

              <button type="submit" class="btn btn-primary w-full">
                Save Settings
              </button>
            </form>
          </div>

          <!-- Danger Zone -->
          <div class="card border-destructive">
            <div class="card-header">
              <h3 class="card-title text-destructive">Danger Zone</h3>
              <p class="card-description">Irreversible and destructive actions</p>
            </div>
            <div class="card-content">
              <button
                @click="handleResetQueues"
                class="btn btn-destructive w-full"
              >
                Reset All Queues
              </button>
              <p class="text-xs text-muted-foreground mt-2 text-center">
                This will delete all queue records. This action cannot be undone.
              </p>
            </div>
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
import ThemeToggle from '@/components/ThemeToggle.vue';
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
