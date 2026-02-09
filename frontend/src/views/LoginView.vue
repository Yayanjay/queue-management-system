<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <!-- Theme Toggle -->
    <div class="fixed top-4 right-4">
      <ThemeToggle />
    </div>

    <!-- Login Card -->
    <div class="card w-full max-w-md">
      <div class="card-header text-center">
        <h1 class="card-title text-3xl mb-2">Queue Management</h1>
        <p class="card-description">Sign in to your account to continue</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="card-content space-y-4">
        <div class="space-y-2">
          <label for="username" class="label">
            Username
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="input"
            placeholder="Enter your username"
          />
        </div>

        <div class="space-y-2">
          <label for="password" class="label">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="input"
            placeholder="Enter your password"
          />
        </div>

        <div v-if="error" class="alert alert-destructive">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full btn btn-primary btn-lg"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="card-footer justify-center">
        <p class="text-sm text-muted-foreground">
          Default credentials: <span class="font-medium">admin</span> / <span class="font-medium">admin123</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ThemeToggle from '@/components/ThemeToggle.vue';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function handleLogin() {
  loading.value = true;
  error.value = '';

  const success = await authStore.login(username.value, password.value);

  if (success) {
    router.push('/staff');
  } else {
    error.value = 'Invalid username or password';
  }

  loading.value = false;
}
</script>
