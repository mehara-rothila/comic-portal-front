import { defineStore } from 'pinia';
import api from '../services/api';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')), // Persist user
        token: localStorage.getItem('token'),
        isAdmin: JSON.parse(localStorage.getItem('isAdmin') || 'false'), // Persist admin status
        loading: false
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        async initialize() {
            if (!this.token) return;
            
            try {
                await this.fetchUser();
                await this.checkAdminStatus();
            } catch (error) {
                console.error('Error initializing auth store:', error);
                this.clearAuth();
            }
        },

        async checkAdminStatus() {
            if (!this.isAuthenticated) return false;
            
            try {
                const response = await api.get('/check-admin');
                this.isAdmin = response.data.is_admin;
                localStorage.setItem('isAdmin', JSON.stringify(this.isAdmin));
                return this.isAdmin;
            } catch (error) {
                console.error('Error checking admin status:', error);
                this.isAdmin = false;
                localStorage.setItem('isAdmin', 'false');
                return false;
            }
        },

        async register(credentials) {
            this.loading = true;
            try {
                const response = await api.post('/register', credentials);
                
                if (!response.data.access_token) {
                    throw new Error('No access token received');
                }

                this.token = response.data.access_token;
                localStorage.setItem('token', response.data.access_token);
                
                if (response.data.user) {
                    this.user = response.data.user;
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                } else {
                    await this.fetchUser();
                }

                return true;
            } catch (error) {
                if (error.response?.data?.errors) {
                    const messages = Object.values(error.response.data.errors).flat();
                    throw new Error(messages[0]);
                }
                throw new Error(error.response?.data?.message || 'Registration failed');
            } finally {
                this.loading = false;
            }
        },

        async login(credentials) {
            this.loading = true;
            try {
                const response = await api.post('/login', credentials);
                
                if (!response.data.access_token) {
                    throw new Error('No access token received');
                }

                this.token = response.data.access_token;
                localStorage.setItem('token', response.data.access_token);
                
                if (response.data.user) {
                    this.user = response.data.user;
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    this.isAdmin = response.data.is_admin || false;
                    localStorage.setItem('isAdmin', JSON.stringify(this.isAdmin));
                } else {
                    await this.fetchUser();
                }

                await this.checkAdminStatus();
                return true;
            } catch (error) {
                if (error.response?.data?.errors) {
                    const messages = Object.values(error.response.data.errors).flat();
                    throw new Error(messages[0]);
                }
                throw new Error(error.response?.data?.message || 'Login failed');
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            this.loading = true;
            try {
                if (this.token) {
                    await api.post('/logout');
                }
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                this.clearAuth();
                this.loading = false;
            }
        },

        clearAuth() {
            this.user = null;
            this.token = null;
            this.isAdmin = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAdmin');
            const router = useRouter();
            router.push('/login');
        },

        async fetchUser() {
            if (!this.token) return null;
            
            try {
                const response = await api.get('/user');
                this.user = response.data.user;
                localStorage.setItem('user', JSON.stringify(response.data.user));
                this.isAdmin = response.data.is_admin || false;
                localStorage.setItem('isAdmin', JSON.stringify(this.isAdmin));
                return this.user;
            } catch (error) {
                console.error('Error fetching user:', error);
                if (error.response?.status === 401) {
                    this.clearAuth();
                }
                throw error;
            }
        }
    }
});