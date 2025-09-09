<template>
    <v-bottom-navigation class="tw-bg-primary-200 tw-mb-2" :elevation="1">
        <v-btn class="tw-mx-auto" to="/machines" link>
            <v-icon>mdi-robot-industrial</v-icon>
        </v-btn>
        <v-btn class="tw-mx-auto" to="/dashboard" link>
            <v-icon>mdi-monitor-dashboard</v-icon>
        </v-btn>
        <v-btn class="tw-mx-auto" to="/profile" link>
            <v-icon>mdi-account</v-icon>
        </v-btn>
    </v-bottom-navigation>
</template>
<script lang="ts" setup>

</script>