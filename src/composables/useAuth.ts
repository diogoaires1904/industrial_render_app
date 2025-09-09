import { useAuthStore } from '@/store/auth';
import { useRoute, useRouter } from 'vue-router';
import axios from '@axios';
import qs from 'qs';

export const useAuth = () => {
    const authStore = useAuthStore();
    const $router = useRouter();
    const $route = useRoute();

    async function checkAuth() {
        if (authStore.getToken) {
            try {
                const { data } = await axios.get(`/users/me?${qs.stringify({
                    populate: ['role', 'picture',]
                })}`);
                console.log(data);
                authStore.setUser(data);
            } catch (error) {
                authStore.$reset();
                const authRequired = $route.matched.some((record) => record.meta.authRequired);
                if (authRequired) {
                    $router.push({ name: 'Login' });
                }
            }
        }
    }

    return {
        checkAuth,
    };
};
