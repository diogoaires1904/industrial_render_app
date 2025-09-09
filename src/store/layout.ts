import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
    const drawer = ref(true)
    const mini = ref(true)

    function toggleDrawer() {
        drawer.value = !drawer.value
    }

    function toggleMini() {
        mini.value = !mini.value
    }

    return {
        drawer,
        mini,
        toggleDrawer,
        toggleMini,
    }
})