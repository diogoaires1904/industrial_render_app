<template>
    <div class="tw-flex tw-flex-col tw-items-center tw-gap-4">
        <div class="tw-text-center">
            <h1 class="tw-mb-3 tw-text-xl tw-font-bold sm:tw-text-2xl">{{ $t('app.welcome') }}</h1>
        </div>
        <v-form ref="form" @submit.prevent="onSubmit" class="auth-form tw-text-center">
            <div>
                <v-label class="tw-mb-2 tw-text-lg sm:tw-text-xl">{{ $t('auth.email') }}</v-label>
                <v-text-field color="dark_green" class="auth-input" v-model.trim="email"
                    :rules="[rules.required, rules.email]" type="email" name="email"></v-text-field>
            </div>
            <div>
                <v-label class="tw-mb-2 tw-text-lg sm:tw-text-xl">{{ $t('auth.password') }}</v-label>
                <v-text-field color="dark_green" class="auth-input" v-model="password" name="current-password"
                    :rules="[rules.required]" :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"></v-text-field>
            </div>

            <div class="tw-flex tw-flex-col tw-gap-2 tw-items-center">
                <div>
                    <router-link
                        class="tw-my-2 tw-text-right tw-text-sm tw-underline tw-text-black sm:tw-my-5 sm:tw-text-base"
                        :to="{ name: 'ForgotPassword' }">
                        {{ $t('auth.forgot_password') }}
                    </router-link>
                </div>
                <div>
                    <v-btn :loading="isLoading" class="tw-mb-2" type="submit" size="x-large" color="primary">
                        {{ $t('auth.login') }}
                    </v-btn>
                </div>
            </div>
        </v-form>
    </div>
</template>

<script setup lang="ts">
import axios from '@axios';
import useRules from '@/composables/rules';
import { ref } from 'vue';
import { VForm } from 'vuetify/lib/components/index.mjs';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import _ from 'lodash';
import slugify from 'slugify';
import { useI18n } from 'vue-i18n';
import qs from 'qs';

const authStore = useAuthStore();
const $router = useRouter();
const $t = useI18n().t;

const rules = useRules();
const form = ref<VForm>();
const isLoading = ref(false);
const isPasswordVisible = ref(false);

const email = ref('diogoaires@iotech.pt');
const password = ref('123456');
const errorMessage = ref('');

async function onSubmit() {
    if (!form.value) return;

    const { valid } = await form.value.validate();
    if (!valid) return;

    isLoading.value = true;

    try {

        let query = qs.stringify({
            populate: ['role', 'picture']
        });
        const { data } = await axios.post(`/auth/local?${query}`, {
            identifier: email.value,
            password: password.value,
        });

        const { data: fullUser } = await axios.get('/users/me', {
            headers: { Authorization: `Bearer ${data.jwt}` },
            params: { populate: ['role', 'picture'] }
        });

        authStore.setToken(data.jwt);
        authStore.setUser(fullUser);

        // Redirect to the home page
        $router.push('/');
    } catch (error) {
        let messageKey = slugify(_.get(error, 'response.data.error.message', 'unknown_error'), {
            replacement: '_',
            trim: true,
            lower: true,
        });
        errorMessage.value = $t(`auth.errors.${messageKey}`);
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    console.log('Login component mounted');
})
</script>