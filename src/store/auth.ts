import { defineStore } from 'pinia';

// const browserLocale = navigator.language.split('-')[0];
// force browserLocale to pt, for testing purposes
const browserLocale = 'pt';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '' as string,
        user: null as any,
        locale: browserLocale,
    }),
    getters: {
        isAuthenticated(): boolean {
            return !!this.token;
        },
        getToken(): string {
            return this.token;
        },
        getUser(): any {
            return this.user;
        },
        getLocale(): string {
            return this.locale;
        },
    },
    actions: {
        setToken(token: string) {
            this.token = token;
        },
        setUser(user: any) {
            this.user = user;
        },
        logout() {
            this.token = '';
            this.user = null;
        },
        setLocale(locale: string) {
            this.locale = locale;
        },

    },
    persist: true,
});
