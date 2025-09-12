<template>
    <v-container v-if="!isMobile" fluid class="tw-p-4">
        <div v-if="machine">
            <h2 class="tw-text-2xl tw-font-bold tw-mb-4">{{ machine.name }}</h2>
            <div>
                <h3 class="tw-text-xl tw-font-semibold tw-mt-6">Ultimas Leituras</h3>
                <v-row class="tw-mt-8">
                    <v-col>
                        <v-card class="tw-p-4 tw-border tw-border-primary">
                            <v-card-title>
                                Energy
                            </v-card-title>
                            <v-card-text>
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
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col>
                        <v-card class="tw-p-4 tw-border tw-border-primary">
                            <v-card-title>
                                Rotations
                            </v-card-title>
                            <v-card-text>
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
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </div>
            <div class="tw-mt-4">
                <v-row>
                    <v-col cols="9">
                        <ModelMachineViewer v-if="machine.object.length > 0"
                            :modelUrl="`https://industrial-render-api.onrender.com${machine.object[0]?.url}`" :danger="logLimit"
                            :isTest="false" :stop="false"/>
                    </v-col>
                    <v-col cols="3">
                        <div class="tw-flex tw-flex-col tw-gap-2">
                            <v-btn @click="openDrawerTest()" color="primary" class="tw-w-24">Testar</v-btn>
                            <v-btn @click="openDrawerDisassemble" color="secondary" class="tw-w-24">Desmontar</v-btn>
                        </div>
                    </v-col>
                </v-row>
            </div>
            <v-navigation-drawer v-model="drawer" temporary location="right" width="900">
                <div class="tw-flex tw-justify-between">
                    <v-btn @click="drawer = false" size="x-small" variant="text" icon><v-icon
                            size="12">mdi-close</v-icon></v-btn>
                </div>
                <div v-if="type === 'Test'">
                    <v-container fluid class="tw-p-4">
                        <div class="tw-mt-4">
                            <div class="tw-mb-4">
                                <ModelMachineViewer v-if="machine.object.length > 0"
                                    :modelUrl="`https://industrial-render-api.onrender.com${machine.object[0]?.url}`" :danger="danger"
                                    :isTest="true" :initTest="initTest" :rpm="rpmTest" :stop="stop"/>
                            </div>
                            <div class="tw-flex tw-gap-2 tw-w-full">
                                <div class="tw-w-full">
                                    <v-card class="tw-p-4 tw-w-full tw-border tw-mb-4 tw-border-primary tw-h-auto">
                                        <v-card-title
                                            @click.stop="testType === '' || testType === 'energy' ? testType = 'rotations' : testType = ''"
                                            class="tw-flex tw-items-center tw-gap-2 tw-cursor-pointer">
                                            <v-icon color="primary" size="20"
                                                v-if="testType == 'rotations'">mdi-circle</v-icon><v-icon
                                                color="primary" size="18"
                                                v-else>mdi-checkbox-blank-circle-outline</v-icon>Rotations
                                        </v-card-title>
                                        <v-card-text v-if="testType === 'rotations'"
                                            class="tw-text-sm tw-text-gray-600">
                                            Teste de rotações por minuto (RPM). Defina a velocidade desejada e inicie o
                                            teste.
                                            Monitore as rotações para garantir que estão dentro dos limites seguros.
                                            Se a velocidade ultrapassar o limite, um alerta será exibido.

                                            <v-text-field flat class="tw-mt-4" v-model="rpm" type="number"
                                                label="Nº de Rotações por Minuto - RPM"></v-text-field>
                                        </v-card-text>
                                    </v-card>
                                </div>
                                <div class="tw-w-full">
                                    <v-card class="tw-p-4 tw-w-full tw-border tw-mb-4 tw-border-primary tw-h-auto">
                                        <v-card-title
                                            @click.stop="testType === '' || testType === 'rotations' ? testType = 'energy' : testType = ''"
                                            class="tw-flex tw-items-center tw-gap-2 tw-cursor-pointer">
                                            <v-icon color="primary" size="20"
                                                v-if="testType == 'energy'">mdi-circle</v-icon><v-icon color="primary"
                                                size="18" v-else>mdi-checkbox-blank-circle-outline</v-icon>Energy
                                        </v-card-title>

                                        <v-card-text v-if="testType === 'energy'" class="tw-text-sm tw-text-gray-600">
                                            Teste de consumo de energia. Defina o valor de energia desejado e inicie o
                                            teste.
                                            Monitore o consumo de energia para garantir que está dentro dos limites
                                            seguros.
                                            Se o consumo ultrapassar o limite, um alerta será exibido.

                                            <v-text-field flat class="tw-mt-4" v-model="energy" type="number"
                                                label="Valor energetico que a maquina esta pronta a receber"></v-text-field>
                                        </v-card-text>
                                    </v-card>
                                </div>
                            </div>
                            <v-row>
                                <div class="tw-p-4 tw-flex tw-justify-end tw-items-center tw-gap-2">
                                    <v-btn color="primary"
                                        @click="testType == 'rotations' ? test(rpm, testType) : test(energy, testType)"
                                        class="tw-w-24">Iniciar
                                        Teste</v-btn>
                                    <v-btn color="secondary" @click="stop = true" class="tw-w-24">Parar Teste</v-btn>
                                </div>
                            </v-row>
                        </div>
                    </v-container>
                </div>
                <div v-else-if="type === 'Disassemble'">
                    <v-container fluid>
                        <v-row>
                            <v-col v-for="(part, index) in parts" :key="index" cols="4">
                                <v-card class="tw-p-2 tw-border tw-border-primary tw-h-64">
                                    <v-card-title class="tw-text-sm tw-font-semibold">
                                        {{ part.name || `Componente ${index + 1}` }}
                                    </v-card-title>
                                    <v-card-text class="tw-h-48">
                                        <PartRenderer :part="part" :width="250" :height="180" />
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </div>
            </v-navigation-drawer>
        </div>
        <v-snackbar v-model="danger" color="error" location="top" timeout="5000" class="tw-z-100">
            <strong>Atenção:</strong> O valor inserido ultrapassa o limite seguro definido para esta máquina. Pode por
            em causa
            danos ou falhas operacionais.
        </v-snackbar>

        <v-snackbar v-model="logLimit" color="error" location="top" timeout="10000" class="tw-z-100">
            <strong>Atenção:</strong> A maquina encontra-se em estado de perigo. Verifique os logs para mais detalhes.

            <template v-slot:actions>
                <v-btn icon color="white" variant="text" @click="logLimit = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>

    <v-container v-if="isMobile" fluid class="tw-p-4">
        <div v-if="machine">
            <h2 class="tw-text-2xl tw-font-bold tw-mb-4">{{ machine.name }}</h2>
            <div>
                <h3 class="tw-text-xl tw-font-semibold tw-mt-6">Ultimas Leituras</h3>
                <v-row class="tw-mt-8">
                    <v-col>
                        <v-card class="tw-p-4 tw-border tw-border-primary">
                            <v-card-title>
                                Energy
                            </v-card-title>
                            <v-card-text>
                                <v-data-table flat items-per-page="5" :headers="heardersEnergy" :items="logsEnergy"
                                    class="tw-w-full">
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
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col>
                        <v-card class="tw-p-4 tw-border tw-border-primary">
                            <v-card-title>
                                Rotations
                            </v-card-title>
                            <v-card-text>
                                <v-data-table flat items-per-page="5" :headers="heardersRotation" :items="logsRotation"
                                    class="tw-w-full">
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
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </div>
            <div class="tw-mt-4">
                <v-row>
                    <v-col cols="12">
                        <ModelMachineViewer v-if="machine.object.length > 0"
                            :modelUrl="`https://industrial-render-api.onrender.com${machine.object[0]?.url}`" :danger="logLimit"
                            :isTest="false" :stop="false"/>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <div class="tw-flex tw-items-center tw-gap-2">
                            <v-btn @click="openDrawerTest()" color="primary" class="tw-w-24">Testar</v-btn>
                            <v-btn @click="openDrawerDisassemble" color="secondary" class="tw-w-24">Desmontar</v-btn>
                        </div>
                    </v-col>
                </v-row>
            </div>
            <v-bottom-sheet v-model="drawer" class="tw-mb-2" height="700">
                <v-card v-if="type === 'Test'">
                    <div class="tw-flex tw-justify-between">
                        <v-btn @click="drawer = false" size="x-small" variant="text" icon><v-icon
                                size="12">mdi-close</v-icon></v-btn>
                    </div>
                    <div>
                        <v-container fluid class="tw-p-4">
                            <div class="tw-mt-4">
                                <div class="tw-mb-4">
                                    <ModelMachineViewer v-if="machine.object.length > 0"
                                        :modelUrl="`https://industrial-render-api.onrender.com${machine.object[0]?.url}`" :danger="danger"
                                        :isTest="true" :initTest="initTest" :rpm="rpmTest" :stop="stop"/>
                                </div>
                                <div class="tw-flex tw-flex-col tw-gap-2 tw-w-full">
                                    <div class="tw-w-full">
                                        <v-card class="tw-p-4 tw-w-full tw-border tw-mb-4 tw-border-primary tw-h-auto">
                                            <v-card-title
                                                @click.stop="testType === '' || testType === 'energy' ? testType = 'rotations' : testType = ''"
                                                class="tw-flex tw-items-center tw-gap-2 tw-cursor-pointer">
                                                <v-icon color="primary" size="20"
                                                    v-if="testType == 'rotations'">mdi-circle</v-icon><v-icon
                                                    color="primary" size="18"
                                                    v-else>mdi-checkbox-blank-circle-outline</v-icon>Rotations
                                            </v-card-title>
                                            <v-card-text v-if="testType === 'rotations'"
                                                class="tw-text-sm tw-text-gray-600">
                                                Teste de rotações por minuto (RPM). Defina a velocidade desejada e
                                                inicie o
                                                teste.
                                                Monitore as rotações para garantir que estão dentro dos limites seguros.
                                                Se a velocidade ultrapassar o limite, um alerta será exibido.

                                                <v-text-field flat class="tw-mt-4" v-model="rpm" type="number"
                                                    label="Nº de Rotações por Minuto - RPM"></v-text-field>
                                            </v-card-text>
                                        </v-card>
                                    </div>
                                    <div class="tw-w-full">
                                        <v-card class="tw-p-4 tw-w-full tw-border tw-mb-4 tw-border-primary tw-h-auto">
                                            <v-card-title
                                                @click.stop="testType === '' || testType === 'rotations' ? testType = 'energy' : testType = ''"
                                                class="tw-flex tw-items-center tw-gap-2 tw-cursor-pointer">
                                                <v-icon color="primary" size="20"
                                                    v-if="testType == 'energy'">mdi-circle</v-icon><v-icon
                                                    color="primary" size="18"
                                                    v-else>mdi-checkbox-blank-circle-outline</v-icon>Energy
                                            </v-card-title>

                                            <v-card-text v-if="testType === 'energy'"
                                                class="tw-text-sm tw-text-gray-600">
                                                Teste de consumo de energia. Defina o valor de energia desejado e inicie
                                                o
                                                teste.
                                                Monitore o consumo de energia para garantir que está dentro dos limites
                                                seguros.
                                                Se o consumo ultrapassar o limite, um alerta será exibido.

                                                <v-text-field flat class="tw-mt-4" v-model="energy" type="number"
                                                    label="Valor energetico que a maquina esta pronta a receber"></v-text-field>
                                            </v-card-text>
                                        </v-card>
                                    </div>
                                </div>
                                <v-row>
                                    <div class="tw-p-4 tw-flex tw-justify-end tw-items-center tw-gap-2">
                                        <v-btn color="primary"
                                            @click="testType == 'rotations' ? test(rpm, testType) : test(energy, testType)"
                                            class="tw-w-24">Iniciar
                                            Teste</v-btn>
                                        <v-btn color="secondary" @click="drawer = false" class="tw-w-24">Parar
                                            Teste</v-btn>
                                    </div>
                                </v-row>
                            </div>
                        </v-container>
                    </div>
                </v-card>
                <v-card v-else-if="type === 'Disassemble'">
                    <div>
                        <v-container fluid>
                            <v-row>
                                <v-col v-for="(part, index) in parts" :key="index" cols="4">
                                    <v-card class="tw-p-2 tw-border tw-border-primary tw-h-64">
                                        <v-card-title class="tw-text-sm tw-font-semibold">
                                            {{ part.name || `Componente ${index + 1}` }}
                                        </v-card-title>
                                        <v-card-text class="tw-h-48">
                                            <PartRenderer :part="part" :width="250" :height="180" />
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-container>
                    </div>
                </v-card>
            </v-bottom-sheet>
        </div>
        <v-snackbar v-model="danger" color="error" location="top" timeout="5000" class="tw-z-100">
            <strong>Atenção:</strong> O valor inserido ultrapassa o limite seguro definido para esta máquina. Pode por
            em causa
            danos ou falhas operacionais.

            <template v-slot:actions>
                <v-btn icon color="white" variant="text" @click="danger = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>

        <v-snackbar v-model="logLimit" color="error" location="top" timeout="10000" class="tw-z-100">
            <strong>Atenção:</strong> A maquina encontra-se em estado de perigo. Verifique os logs para mais detalhes.

            <template v-slot:actions>
                <v-btn icon color="white" variant="text" @click="logLimit = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { getMachine } from '@/api/machines';
import { useLoader } from '@/composables/useLoader';
import ModelMachineViewer from './ModelMachineViewer.vue';
import { useAlert } from '@/composables/useAlert';
import { dangerLogs } from '../Dashboard/logs';
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useDisplay } from 'vuetify';

const lgAndUp = useDisplay()

const isMobile = computed(() => {
    console.log('isMobile', lgAndUp.mobile.value);
    return lgAndUp.mobile.value;
});


const parts = ref<THREE.Object3D[]>([])

console.log('Danger Logs:', dangerLogs);

const $alert = useAlert();

const testType = ref<string>('');

const type = ref<string>('');
const drawer = ref<boolean>(false);

const { showLoader, hideLoader } = useLoader();
const isLoading = ref(false);

const rpm = ref<number>(0);
const energy = ref<number>(0);

const $route = useRoute();

const machineId = $route.params.id as string;

const machine = ref<any>(null);

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

const fetchMachine = async (documentID: string) => {
    isLoading.value = true;
    showLoader();
    try {
        const query = {
            populate: ['logs.variables_of_consumption', 'object', 'warehouse.user', 'limits.variables_of_consumption'],
        }
        const response = await getMachine(documentID, query);
        machine.value = (response.data as any).data;
        if (machine.value && machine.value.logs) {
            logsEnergy.value = machine.value.logs.filter((log: any) => log.variables_of_consumption.variable === 'energy');
            logsRotation.value = machine.value.logs.filter((log: any) => log.variables_of_consumption.variable === 'rotations');
        }
    } catch (error) {
        console.error('Error fetching machine:', error);
    } finally {
        isLoading.value = false;
        hideLoader();
    }
}

const openDrawerTest = () => {
    drawer.value = true;
    type.value = 'Test';
}

const openDrawerDisassemble = () => {
    drawer.value = true;
    type.value = 'Disassemble';
}

const danger = ref<boolean>(false);

const initTest = ref<boolean | undefined>(undefined);
const rpmTest = ref<number>(0);
const stop = ref<boolean>(false);

const test = (number: number, type: string) => {
    initTest.value = true;
    rpmTest.value = number;
    stop.value = false;
    if (type === 'rotations') {
        console.log('Checking rotations limit');
        const rotationsLimit = machine.value.limits.find((limit: any) => limit.variables_of_consumption.variable === 'rotations');
        console.log('Rotations limit:', rotationsLimit);

        if (number > rotationsLimit.value) return danger.value = true
    } else if (type === 'energy') {
        const energyLimit = machine.value.limits.find((limit: any) => limit.variables_of_consumption.variable === 'energy');
        if (number > energyLimit.value) return danger.value = true
    }
    return danger.value = false;
}

watch(() => danger.value, (newVal) => {
    if (newVal) {
        $alert.showAlert({
            type: 'error',
            text: 'O valor inserido ultrapassa o limite seguro definido para esta máquina. Por favor, ajuste o valor para evitar danos ou falhas operacionais.',
        })
    }
});

let logIndex = 0;
let intervalId: any = null;

const logLimit = ref<boolean>(false);

const checkLogLimitValue = (log: any) => {
    if (!machine.value || !machine.value.limits) return false;

    const limit = machine.value.limits.find((lim: any) => lim.variables_of_consumption.id === log.variables_of_consumption);
    if (!limit) return false;

    return logLimit.value = log.value > limit.value;
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
    if (machineId) {
        await fetchMachine(machineId);
    }
    startLogSimulation();
});

onMounted(async () => {
    if (machineId) {
        await fetchMachine(machineId);
    }
    const loader = new GLTFLoader()
    if (machine.value) {
        loader.load(`https://industrial-render-api.onrender.com${machine.value.object[0].url}`, (gltf) => {
            const extracted: THREE.Object3D[] = []
            gltf.scene.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    extracted.push(child)
                }
            })
            parts.value = extracted
        })
    }

});
</script>