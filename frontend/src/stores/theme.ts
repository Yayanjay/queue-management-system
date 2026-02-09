import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export type Theme = 'light' | 'dark';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('light');

  // Load theme from localStorage on init
  function loadTheme() {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      theme.value = stored;
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme.value = prefersDark ? 'dark' : 'light';
    }
    applyTheme();
  }

  // Apply theme to document
  function applyTheme() {
    const root = document.documentElement;
    if (theme.value === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  // Toggle theme
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  }

  // Set specific theme
  function setTheme(newTheme: Theme) {
    theme.value = newTheme;
  }

  // Watch theme changes and save to localStorage
  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme);
    applyTheme();
  });

  return {
    theme,
    loadTheme,
    toggleTheme,
    setTheme,
  };
});
