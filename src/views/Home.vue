<template>
    <Navbar v-if="showNavbar" />
    <v-main class="tw-bg-white" :class="{
        'tw-pl-1': isMobile,
        'tw-pl-20': layout.drawer && !layout.mini,
        'tw-pl-52': layout.drawer && layout.mini
    }">
        <Suspense>
            <router-view />
        </Suspense>
    </v-main>
    <BottomBar v-if="showBottomBar" />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import Navbar from './Layout/Navbar.vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useLayoutStore } from '@/store/layout'
import BottomBar from './Layout/BottomBar.vue';

const authStore = useAuthStore();
const me = authStore.user;
console.log('me', me);
const $route = useRoute();

const lgAndUp = useDisplay()

const layout = useLayoutStore()
watch(() => layout, (newVal) => {
    console.log('layout changed', newVal.drawer.valueOf(), newVal.mini.valueOf());
}, { deep: true, immediate: true });

const isMobile = computed(() => {
    console.log('isMobile', lgAndUp.mobile.value);
    return lgAndUp.mobile.value;
});

const showNavbar = computed(() => {
    console.log('showNavbar', $route.meta?.showNavbar);
    return $route.meta?.showNavbar && !isMobile.value;
});

const showBottomBar = computed(() => {
    console.log('showBottomBar', $route.meta?.showBottomBar);
    return $route.meta?.showBottomBar && isMobile.value;
});

</script>