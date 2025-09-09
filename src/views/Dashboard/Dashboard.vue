<template>
    <v-container v-if="!isMobile" fluid class="tw-px-2 tw-pt-4">
        <div v-if="!isLoading">
            <div v-for="warehouse in warehouses" :key="warehouse.id" class="tw-mb-8 tw-items-center">
                <h2 class="tw-text-2xl tw-font-bold tw-mb-4">{{ warehouse.name }}</h2>
                <!--model3D-->
                <div class="tw-mb-4">
                    <ModelViewer :code="code" @update:code="code = $event"
                        v-if="warehouse.model3D && warehouse.model3D.length > 0"
                        :src="`https://industrial-render-api.onrender.com/${warehouse.model3D[0].url}`" :click="true" :logLimit="logLimit"
                        :machineDanger="machinDanger" />
                </div>
            </div>
            <div>
                <v-row class="tw-mt-8">
                    <v-col>
                        <v-card class="tw-p-4 tw-border tw-border-primary">
                            <v-card-title>
                                Energy
                            </v-card-title>
                            <v-card-content>
                                <v-data-table items-per-page="5" :headers="heardersEnergy" :items="logsEnergy"
                                    class="elevation-1">
                                    <template #item.date="{ item }">
                                        {{ new Date(item.createdAt).toLocaleDateString() }}
                                    </template>
                                    <template #item.time="{ item }">
                                        {{ new Date(item.createdAt).toLocaleTimeString() }}
                                    </template>
                                    <template #item.value="{ item }">
                                        {{ item.value }}
                                    </template>
                                </v-data-table>
                            </v-card-content>
                        </v-card>
                    </v-col>

                    <v-col>
                        <v-card class="tw-p-4 tw-border tw-border-primary">
                            <v-card-title>
                                Rotations
                            </v-card-title>
                            <v-card-content>
                                <v-data-table items-per-page="5" :headers="heardersRotation" :items="logsRotation"
                                    class="elevation-1">
                                    <template #item.date="{ item }">
                                        {{ new Date(item.createdAt).toLocaleDateString() }}
                                    </template>
                                    <template #item.time="{ item }">
                                        {{ new Date(item.createdAt).toLocaleTimeString() }}
                                    </template>
                                    <template #item.value="{ item }">
                                        {{ item.value }}
                                    </template>
                                </v-data-table>
                            </v-card-content>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row class="tw-mt-8">
                    <v-col cols="6">
                        <v-card class="tw-p-4 tw-border tw-border-primary">
                            <v-card-title>
                                Energy Over Time
                            </v-card-title>
                            <v-card-content>
                                <canvas id="energyChart"></canvas>
                            </v-card-content>
                        </v-card>
                    </v-col>

                    <v-col cols="6">
                        <v-card class="tw-p-4 tw-border tw-border-primary">
                            <v-card-title>
                                Rotations Over Time
                            </v-card-title>
                            <v-card-content>
                                <canvas id="rotationChart"></canvas>
                            </v-card-content>
                        </v-card>
                    </v-col>
                </v-row>
            </div>
        </div>
        <v-navigation-drawer v-model="drawer" temporary location="right" width="600">
            <div class="tw-p-4">
                <v-btn icon @click="drawer = false" class="tw-mb-4">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <div v-if="code">
                    <h3 class="tw-text-lg tw-font-semibold tw-mb-2">{{ code }}</h3>
                    <div v-if="machine">
                        <p><strong>type:</strong> {{ machine.type }}</p>
                        <ModelViewer v-if="machine.object && machine.object.length > 0" :code="code"
                            :src="`https://industrial-render-api.onrender.com/${machine.object[0].url}`" :click="false"
                            :logLimit="logLimit" />
                    </div>
                    <div>
                        <v-btn color="primary" class="tw-mt-4" @click="seeDetails(machine.documentId)">See
                            Details</v-btn>
                    </div>
                </div>
                <div v-else>
                    <p>No machine selected.</p>
                </div>
            </div>
        </v-navigation-drawer>

        <v-snackbar v-model="logLimit" color="error" location="top" timeout="10000" class="tw-z-100">
            <strong>Atenção:</strong> A maquina {{ machinDanger }} encontra-se em estado de perigo. Verifique os logs
            para mais
            detalhes.
        </v-snackbar>
    </v-container>
    <v-container v-if="isMobile" fluid class="tw-px-2 tw-pt-4">
        <div v-if="!isLoading">
            <div v-for="warehouse in warehouses" :key="warehouse.id" class="tw-mb-8 tw-items-center">
                <h2 class="tw-text-2xl tw-font-bold tw-mb-4">{{ warehouse.name }}</h2>
                <!--model3D-->
                <div class="tw-mb-4">
                    <ModelViewer :code="code" @update:code="code = $event"
                        v-if="warehouse.model3D && warehouse.model3D.length > 0"
                        :src="`https://industrial-render-api.onrender.com/${warehouse.model3D[0].url}`" :click="true" :logLimit="logLimit"
                        :machineDanger="machinDanger" />
                </div>
            </div>
            <div>
                <v-row class="tw-mt-8">
                    <v-col>
                        <v-card class="tw-p-4 tw-border tw-border-primary">
                            <v-card-title>
                                Energy
                            </v-card-title>
                            <v-card-content>
                                <v-data-table items-per-page="5" :headers="heardersEnergy" :items="logsEnergy"
                                    class="elevation-1">
                                    <template #item.date="{ item }">
                                        {{ new Date(item.createdAt).toLocaleDateString() }}
                                    </template>
                                    <template #item.time="{ item }">
                                        {{ new Date(item.createdAt).toLocaleTimeString() }}
                                    </template>
                                    <template #item.value="{ item }">
                                        {{ item.value }}
                                    </template>
                                </v-data-table>
                            </v-card-content>
                        </v-card>
                    </v-col>

                    <v-col>
                        <v-card class="tw-p-4 tw-border tw-border-primary">
                            <v-card-title>
                                Rotations
                            </v-card-title>
                            <v-card-content>
                                <v-data-table items-per-page="5" :headers="heardersRotation" :items="logsRotation"
                                    class="elevation-1">
                                    <template #item.date="{ item }">
                                        {{ new Date(item.createdAt).toLocaleDateString() }}
                                    </template>
                                    <template #item.time="{ item }">
                                        {{ new Date(item.createdAt).toLocaleTimeString() }}
                                    </template>
                                    <template #item.value="{ item }">
                                        {{ item.value }}
                                    </template>
                                </v-data-table>
                            </v-card-content>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row class="tw-mt-8">
                    <v-col cols="12">
                        <v-card class="tw-p-4 tw-border tw-border-primary">
                            <v-card-title>
                                Energy Over Time
                            </v-card-title>
                            <v-card-content>
                                <canvas id="energyChart"></canvas>
                            </v-card-content>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row class="tw-mt-8">
                    <v-col cols="12">
                        <v-card class="tw-p-4 tw-border tw-border-primary">
                            <v-card-title>
                                Rotations Over Time
                            </v-card-title>
                            <v-card-content>
                                <canvas id="rotationChart"></canvas>
                            </v-card-content>
                        </v-card>
                    </v-col>
                </v-row>
            </div>
        </div>
        <v-bottom-sheet v-model="drawer" class="tw-z-50" elevation="1" height="700" :scrim="false">
            <v-card class="tw-mb-4">
                <div class="tw-p-4">
                    <v-btn icon @click="drawer = false" class="tw-mb-4">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <div v-if="code">
                        <h3 class="tw-text-lg tw-font-semibold tw-mb-2">{{ code }}</h3>
                        <div v-if="machine">
                            <p><strong>type:</strong> {{ machine.type }}</p>
                            <ModelViewer v-if="machine.object && machine.object.length > 0" :code="code"
                                :src="`https://industrial-render-api.onrender.com/${machine.object[0].url}`" :click="false"
                                :logLimit="logLimit" />
                        </div>
                        <div>
                            <v-btn color="primary" class="tw-mt-4" @click="seeDetails(machine.documentId)">See
                                Details</v-btn>
                        </div>
                    </div>
                    <div v-else>
                        <p>No machine selected.</p>
                    </div>
                </div>
            </v-card>
        </v-bottom-sheet>

        <v-snackbar v-model="logLimit" color="error" closable location="top" timeout="10000" class="tw-z-100">
            <strong>Atenção:</strong> A maquina {{ machinDanger }} encontra-se em estado de perigo. Verifique os logs
            para
            mais detalhes.

            <template v-slot:actions>
                <v-btn icon color="white" variant="text" @click="logLimit = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { getWarehouses } from '@/api/warehouses';
import { useLoader } from '@/composables/useLoader';
import ModelViewer from './ModelViewer.vue';
import { getMachines } from '@/api/machines';
import { useRouter } from 'vue-router';
import { getLogs } from '@/api/logs';
import Chart from 'chart.js/auto';
import { useDisplay } from 'vuetify';

const isLoading = ref<boolean>(false);
const { showLoader, hideLoader } = useLoader();

const $router = useRouter();

const warehouses = ref<any>([]);

const code = ref<string>('');

const drawer = ref(false);

const machine = ref<any>(null);



const fetchMachineDetails = async (machineCode: string) => {
    showLoader();
    try {
        const query = {
            filters: {
                codes: {
                    code: {
                        $in: [machineCode]
                    }
                }
            },
            populate: ['codes', 'object']
        };

        const response = await getMachines(query);

        console.log('Machine Response:', response);
        if (response.data && (response.data as any).data.length > 0) {
            machine.value = (response.data as any).data[0];
            console.log('Machine Details:', machine.value);
        } else {
            machine.value = null;
            console.log('No machine found with the provided code.');
        }
    } catch (error) {
        console.error('Error fetching machine details:', error);
    } finally {
        hideLoader();
    }
}

const logs = ref<any[]>([]);
const logsEnergy = ref<any[]>([]);
const logsRotation = ref<any[]>([]);

const heardersEnergy = [
    { title: 'Date', value: 'date' },
    { title: 'Time', value: 'time' },
    { title: 'Value', value: 'value' },
    { title: 'Unity', value: 'unity' },
]

const heardersRotation = [
    { title: 'Date', value: 'date' },
    { title: 'Time', value: 'time' },
    { title: 'Value', value: 'value' },
    { title: 'Unity', value: 'unity' },
]

const logsWareHouse = async () => {
    console.log('logs ware house', logs.value, warehouses.value);
    if (logs.value.length > 0 && warehouses.value.length > 0) {
        logsEnergy.value = logs.value.filter(
            (log: any) => {
                return log.variables_of_consumption.variable === 'energy'
            })

        logsRotation.value = logs.value.filter(
            (log: any) => {
                return log.variables_of_consumption.variable === 'rotations'
            })
    }
}

const fetchLogs = async () => {
    showLoader();
    try {
        const query = {
            populate: ['variables_of_consumption', 'machine']
        }

        const response = await getLogs(query);
        console.log('Logs Response:', response);
        logs.value = response.data;
    } catch (error) {
        console.error('Error fetching logs:', error);
    } finally {
        hideLoader();
        await logsWareHouse();
        await renderCharts();
    }
};

const renderCharts = async () => {
    // Energy Chart
    const energyCtx = document.getElementById('energyChart') as HTMLCanvasElement;
    if (energyCtx) {
        new Chart(energyCtx, {
            type: 'line',
            data: {
                labels: logsEnergy.value.map(l =>
                    new Date(l.createdAt).toLocaleTimeString()
                ),
                datasets: [
                    {
                        label: 'Energy (kWh)',
                        data: logsEnergy.value.map(l => parseFloat(l.value)),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59,130,246,0.2)',
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } }
            }
        });
    }

    // Rotation Chart
    const rotationCtx = document.getElementById('rotationChart') as HTMLCanvasElement;
    if (rotationCtx) {
        new Chart(rotationCtx, {
            type: 'line',
            data: {
                labels: logsRotation.value.map(l =>
                    new Date(l.createdAt).toLocaleTimeString()
                ),
                datasets: [
                    {
                        label: 'Rotations (RPM)',
                        data: logsRotation.value.map(l => parseFloat(l.value)),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16,185,129,0.2)',
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } }
            }
        });
    }
};

const lgAndUp = useDisplay()

const isMobile = computed(() => {
    console.log('isMobile', lgAndUp.mobile.value);
    return lgAndUp.mobile.value;
});


watch(code, (newCode) => {
    console.log('Selected Code:', newCode);
    drawer.value = newCode !== '';

    if (newCode) {
        fetchMachineDetails(newCode);
    }
});

const fetchWarehouses = async () => {
    isLoading.value = true;
    showLoader();
    try {
        const query = {
            populate: ['model3D', 'machines']
        }
        const response = await getWarehouses(query);
        warehouses.value = response.data;
        console.log('Warehouses:', warehouses.value);
    } catch (error) {
        console.error('Error fetching warehouses:', error);
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

import { dangerLogs } from './logs';

let logIndex = 0;
let intervalId: any = null;

const logLimit = ref<boolean>(false);
const machinDanger = ref<string>('');

const checkLogLimitValue = (log: any) => {
    const mach = warehouses.value.length > 0 ? warehouses.value[0].machines.find((m: any) => m.id === log.machine) : null;
    console.log('Machine:', mach, 'log', log);
    if (mach.limits?.length == 0) return false;

    const limit = mach.limits.find((lim: any) => lim.variables_of_consumption.id === log.variables_of_consumption);
    console.log('Checking log against limit:', limit);
    if (!limit) return false;

    logLimit.value = log.value > limit.value;
    machinDanger.value = mach.codes[0].code;
    console.log('Log limit status:', logLimit.value, machinDanger.value);
}

const startLogSimulation = () => {
    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
        if (logIndex >= dangerLogs.length) {
            clearInterval(intervalId);
            return;
        }

        const log = dangerLogs[logIndex];
        const formattedLog = {
            ...log,
            createdAt: new Date(),
        };

        if (log.variables_of_consumption === 1) {
            logsRotation.value.unshift(formattedLog);
        } else if (log.variables_of_consumption === 2) {
            logsEnergy.value.unshift(formattedLog);
        }

        checkLogLimitValue(log);
        logIndex++;
    }, 30000);
}

onMounted(async () => {
    await fetchWarehouses();
    await fetchLogs();
    startLogSimulation();
});
</script>