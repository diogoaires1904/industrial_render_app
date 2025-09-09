<template>
    <div class="tw-flex tw-w-full tw-flex-col tw-items-center tw-gap-4">
        <h1 class="auth-title">{{ $t('auth.forgot_password') }}</h1>
        <v-form
            ref="form"
            @submit.prevent="onSubmit"
            class="auth-form"
            action="">
            <v-text-field
                v-model.trim="email"
                flat
                density="comfortable"
                class="auth-input tw-rounded-xl tw-border tw-border-gray-300 tw-bg-white"
                :rules="[rules.required, rules.email]"
                type="email"
                name="email"
                :placeholder="$t('auth.email')"></v-text-field>
            <div v-if="alertMessage">
                <v-alert
                    :type="alertType"
                    variant="tonal"
                    density="compact"
                    >{{ alertMessage }}</v-alert
                >
            </div>

            <v-btn
                :loading="isLoading"
                type="submit"
                color="primary"
                class="auth-btn"
                >{{ $t('auth.send_reset_link') }}</v-btn
            >
        </v-form>
    </div>
    <router-link
        class="tw-text-center tw-underline"
        :to="{ name: 'Login' }"
        >{{ $t('auth.backToLogin') }}</router-link
    >
</template>

<script setup lang="ts">
    import axios from '@axios';
    import useRules from '@/composables/rules';
    import { ref } from 'vue';
    import { VForm } from 'vuetify/lib/components/index.mjs';
    import _ from 'lodash';
    import slugify from 'slugify';
    import { useI18n } from 'vue-i18n';

    const $t = useI18n().t;

    const rules = useRules();
    const form = ref<VForm>();
    const isLoading = ref(false);

    const email = ref('demo@demo.pt');
    const alertMessage = ref('');
    const alertType = ref<'success' | 'error'>('success');

    async function onSubmit() {
        if (!form.value) return;

        alertMessage.value = '';
        form.value.resetValidation();

        const { valid } = await form.value.validate();
        if (!valid) return;

        isLoading.value = true;

        try {
            const { data } = await axios.post('/auth/forgot-password', {
                email: email.value,
            });

            alertMessage.value = $t('auth.forgotPasswordSuccess');
            alertType.value = 'success';
        } catch (error) {
            let messageKey = slugify(_.get(error, 'response.data.error.message', 'unknown_error'), {
                replacement: '_',
                trim: true,
                lower: true,
            });
            alertMessage.value = $t(`auth.errors.${messageKey}`, '', {
                default: $t('auth.errors.unknown_error'),
            });
            alertType.value = 'error';
        } finally {
            isLoading.value = false;
        }
    }
</script>

<style scoped></style>
