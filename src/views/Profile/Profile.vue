<template>
    <v-container fluid v-if="me && user">
        <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-mt-10">
            <ioImg :media="me?.picture" cover :aspect-ratio="1" format="thumbnail"
                class="tw-w-32 tw-h-32 tw-rounded-full" content-type="Media"></ioImg>

            <v-text-field v-model="user.name" label="Nome" readonly class="tw-mt-4 tw-w-64">
            </v-text-field>

            <v-text-field v-model="user.email" label="Email" readonly class="tw-mt-4 tw-w-64">
            </v-text-field>

            <v-text-field v-model="user.username" label="Username" readonly class="tw-mt-4 tw-w-64">
            </v-text-field>
        </div>
    </v-container>
</template>
<script lang="ts" setup>
import { useAuthStore } from '@/store/auth';
import ioImg from '@/components/ioImg.vue';

const authStore = useAuthStore();
const me = authStore.user;

const user = ref({
    name: me?.name,
    email: me?.email,
    username: me?.username,
});
</script>