// Composables
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

// HOME
import Home from '@/views/Home.vue';

// AUTH
import Auth from '@/views/Auth/Auth.vue';
import Login from '@/views/Auth/Login.vue';
import ForgotPassword from '@/views/Auth/ForgotPassword.vue';

// DASHBOARD
import Dashboard from '@/views/Dashboard/Dashboard.vue';

// MACHINES
import Machines from '@/views/Machines/Machines.vue';
import Machine from '@/views/Machines/Machine.vue';

// PROFILE
import Profile from '@/views/Profile/Profile.vue';

const routes = [
    {
        path: '/auth',
        name: 'Auth',
        component: Auth,
        redirect: { name: 'Login' },
        beforeEnter: (to: any, from: any, next: any) => {
            const authStore = useAuthStore();
            if (authStore.isAuthenticated) {
                next({ name: 'Home' });
            } else {
                next();
            }
        },
        children: [
            {
                path: 'login',
                name: 'Login',
                component: Login,
            },
            {
                path: 'forgot-password',
                name: 'ForgotPassword',
                component: ForgotPassword,
            },
        ],
        meta: {
            authRequired: false,
            showBreadcrumbs: false,
            showNavbar: false,
            showTopBar: false,
            showBottomBar: false,
            showFooter: false,
        },
    },

    {
        path: '/',
        component: Home,
        name: 'Home',
        redirect: { name: 'Dashboard' },
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: Dashboard,
                meta: {
                    showNavbar: true,
                    showBreadcrumbs: true,
                    showTopBar: true,
                    showBottomBar: true,
                    showFooter: true,
                    title: 'Dashboard',
                },
            },
            {
                path: '/machines',
                name: 'Machines',
                component: Machines,
                meta: {
                    showNavbar: true,
                    showBreadcrumbs: true,
                    showTopBar: true,
                    showBottomBar: true,
                    showFooter: true,
                    title: 'Machines',
                },
            },
            {
                path: '/machines/:id',
                name: 'Machine',
                component: Machine,
                meta: {
                    showNavbar: true,
                    showBreadcrumbs: true,
                    showTopBar: true,
                    showBottomBar: true,
                    showFooter: true,
                    title: 'Machine Details',
                },
            },
            {
                path: '/profile',
                name: 'Profile',
                component: Profile,
                meta: {
                    showNavbar: true,
                    showBreadcrumbs: true,
                    showTopBar: true,
                    showBottomBar: true,
                    showFooter: true,
                    title: 'Profile',
                }
            }
        ],
        meta: {
            authRequired: true,
            showNavbar: true,
            showBreadcrumbs: true,
            showTopBar: true,
            showBottomBar: true,
            showFooter: true,
        },
    },
] as Readonly<RouteRecordRaw[]>;

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to: any, from: any, savedPosition: any) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
});

router.beforeEach((to: any, from: any, next: any) => {
    const authStore = useAuthStore();
    if (to.meta.authRequired && !authStore.isAuthenticated) {
        next({ name: 'Login' });
    } else {
        next();
    }
});

export default router;