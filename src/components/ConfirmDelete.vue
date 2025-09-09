<template>
    <v-dialog
        v-model="isOpen"
        max-width="420">
        <v-card
            prepend-icon="mdi-delete"
            :title="$t('components.confirmDelete.title')">
            <v-card-text> {{ $t('components.confirmDelete.text') }} </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="gray"
                    variant="flat"
                    @click="onAction('no')"
                    >{{ $t('shared.no') }}</v-btn
                >
                <v-btn
                    color="red"
                    variant="flat"
                    @click="onAction('yes')"
                    >{{ $t('shared.yes') }}</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
    import { is } from '@babel/types';
    import { watch } from 'vue';
    import { ref } from 'vue';

    const props = defineProps<{
        modelValue: boolean;
    }>();

    const emit = defineEmits<{
        (e: 'update:modelValue', value: boolean): void;
        (e: 'action', value: string): void;
    }>();

    const isOpen = ref(false);

    function onAction(value: string) {
        emit('action', value);
        isOpen.value = false;
    }

    watch(
        () => props.modelValue,
        (value) => {
            isOpen.value = value;
        },
        {
            immediate: true,
        },
    );

    watch(
        () => isOpen.value,
        (value) => {
            emit('update:modelValue', value);
        },
    );
</script>

<style scoped></style>
