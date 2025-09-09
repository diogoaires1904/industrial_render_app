<template>
    <v-app-bar app color="primary" dark>
        <div class="tw-w-full tw-flex tw-justify-between tw-items-center">
            <div class="tw-ml-4 tw-flex tw-gap-2">
                <v-icon color="white" @click="layout.toggleMini">mdi-factory</v-icon>
                <v-toolbar-title class="text-h6">Renderizer</v-toolbar-title>
            </div>
            <v-btn icon variant="text" class="tw-text-white">
                <v-icon size="20" @click="logout">mdi-logout</v-icon>
            </v-btn>
        </div>
    </v-app-bar>

    <v-navigation-drawer :class="[!layout.mini ? 'tw-w-16' : 'tw-w-48']" v-model="layout.drawer"
        :mini-variant="layout.mini" color="grey-lighten-4">
        <div class="tw-flex tw-justify-end">
            <v-btn size="20" variant="text" v-if="layout.mini" icon @click="layout.toggleMini" class="tw-mr-2 tw-mt-2">
                <v-icon size="18">mdi-window-close</v-icon>
            </v-btn>
        </div>
        <!-- Links -->
        <v-list density="compact" nav>
            <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
                <v-icon v-if="!layout.mini" :icon="item.icon" class="tw-mr-2" />
                <v-list-item-title v-if="layout.mini" class="tw-flex tw-gap-2 tw-items-center tw-text-md"><v-icon>{{
                    item.icon
                        }}</v-icon>
                    <p class="tw-text-md">{{ item.title }}</p>
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <template v-slot:append>
            <div class="pa-2">
                <v-list density="compact" nav>
                    <v-list-item to="/profile" link>
                        <div v-if="!layout.mini" class="tw-w-10">
                            <v-icon :icon="me?.picture ? 'mdi-account' : 'mdi-account-outline'" class="tw-mr-2"/>
                        </div>
                        <v-list-item-title v-if="layout.mini" class="tw-text-md tw-flex tw-items-center tw-gap-2">
                            <div class="tw-w-12">
                                <ioImg :media="me?.picture" cover :aspect-ratio="1" format="thumbnail"
                                    class="tw-w-12 tw-rounded-full" content-type="Media"></ioImg>
                            </div>
                            <p class="tw-text-md">{{ me?.name }}</p>
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </div>
        </template>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { useLayoutStore } from '@/store/layout'
import ioImg from '@/components/ioImg.vue';

const layout = useLayoutStore()
const authStore = useAuthStore();
const $router = useRouter();

const me = authStore.user;

function logout() {
    authStore.logout();
    $router.push({
        name: 'Login',
    });
}

const items = [
    { title: 'Dashboard', icon: 'mdi-monitor-dashboard', to: '/dashboard' },
    { title: 'Machines', icon: 'mdi-robot-industrial', to: '/machines' },
]
</script>