<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();

onMounted(() => {
  settingsStore.fetchSettings();
});
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #f3f4f6;
}
</style>
