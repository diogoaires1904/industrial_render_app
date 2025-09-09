<template>
    <main class="tw-flex tw-h-screen ">
        <!-- Coluna da esquerda (formulário) -->
        <div
            class="tw-z-10 tw-flex tw-w-full sm:tw-w-1/2 tw-flex-col tw-items-center tw-justify-center tw-gap-8 tw-bg-white tw-p-4 sm:tw-p-10">
            <div class="tw-flex tw-w-full tw-items-center tw-justify-center tw-px-4 sm:tw-hidden md:tw-hidden">
                <!-- <v-img src="/logo.svg" width="100%" max-width="10rem"></v-img> -->
            </div>
            <router-view />
        </div>

        <!-- Coluna da direita (imagem) -->
        <div id="login-background" class="tw-hidden sm:tw-block sm:tw-w-[80%] tw-cover tw-h-full"></div>
    </main>
</template>

<script setup lang="ts"></script>

<style scoped>
#login-background {
    background-image: linear-gradient(to right, white 0%, rgba(255,255,255,0) 30%), url('../../assets/images/industry_render.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-color: transparent;
    margin-left: -2.5rem;
}
</style>