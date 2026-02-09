import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

export interface User {
  id: number;
  username: string;
  name: string;
  role: 'admin' | 'staff';
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  function loadFromStorage() {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = JSON.parse(storedUser);
    }
  }

  async function login(username: string, password: string) {
    try {
      const response = await api.post('/auth/login', { username, password });
      token.value = response.data.access_token;
      user.value = response.data.user;
      
      if (token.value) {
        localStorage.setItem('token', token.value);
      }
      if (user.value) {
        localStorage.setItem('user', JSON.stringify(user.value));
      }
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    loadFromStorage,
    login,
    logout,
  };
});
