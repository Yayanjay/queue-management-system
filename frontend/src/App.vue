<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { useThemeStore } from '@/stores/theme';

const settingsStore = useSettingsStore();
const themeStore = useThemeStore();

onMounted(() => {
  settingsStore.fetchSettings();
  themeStore.loadTheme();
});
</script>

<style>
#app {
  min-height: 100vh;
  background-color: var(--background);
  color: var(--foreground);
}
</style>
