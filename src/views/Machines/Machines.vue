<template>
    <v-container fluid class="tw-p-4">
        <div v-for="machine in machines" :key="machine.id" class="tw-mb-4">
            <v-card class="tw-w-full tw-border tw-border-primary">
                <v-card-title class="tw-text-lg tw-font-semibold">
                    <div class="tw-flex tw-items-center tw-justify-between">
                        <p>{{ machine.name }} - {{ machine.warehouse.name }}</p>
                        <p class="tw-cursor-pointer"><v-icon @click="seeDetails(machine.documentId)" color="primary">mdi-chevron-right</v-icon></p>
                    </div>
                </v-card-title>
            </v-card>
        </div>
    </v-container>
</template>

<script lang="ts" setup>
import { getMachines } from '@/api/machines';
import { useAuthStore } from '@/store/auth';
import { useLoader } from '@/composables/useLoader';
import { useRouter } from 'vue-router';

const $router = useRouter();
const {showLoader, hideLoader} = useLoader();
const isLoading = ref(false);

const authStore = useAuthStore();

const me = authStore.user;

const machines = ref<any[]>([]);

const fetchMachines = async () => {
    isLoading.value = true;
    showLoader();
    try {
        const query = {
            populate: ['logs', 'object', 'warehouse.user'],
            filters: {
                warehouse: {
                    user: {
                        id: {
                            $eq: me.id,
                        }
                    },
                },
            }
        }
        const response = await getMachines(query);
        machines.value = (response.data as any).data;
    } catch (error) {
        console.error('Error fetching machines:', error);
    } finally {
        isLoading.value = false;
        hideLoader();
    }
};

const seeDetails = (documentId: string) => {
    if (documentId) {
        $router.push({ name: 'Machine', params: { id: documentId } });
    }
}

onMounted(async () => {
    await fetchMachines();
});

</script>