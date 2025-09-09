<template>
    <v-app>
      <PromptUpdate />
      <PromptInstall />
      <router-view />
      <v-overlay persistent class="centered-content" location-strategy="connected" scroll-strategy="reposition"
        :model-value="isLoading">
        <v-progress-circular indeterminate size="48" color="primary"></v-progress-circular>
      </v-overlay>
    </v-app>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from './store/auth';
import { useLoader } from './composables/useLoader';
import { computed } from 'vue';
import PromptUpdate from './components/PromptUpdate.vue';
import PromptInstall from './components/PromptInstall.vue';

const { getLoader } = useLoader();
const isLoading = computed(() => getLoader.value);

const { locale } = useI18n();
const authStore = useAuthStore();

locale.value = authStore.getLocale;

useAuth().checkAuth();

</script>

<style lang="scss">
.centered-content {
  .v-overlay__content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
