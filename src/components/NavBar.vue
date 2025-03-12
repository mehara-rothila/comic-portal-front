<template>
    <nav class="bg-gray-800 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="text-white text-xl font-bold">Comic Portal</router-link>
        
        <div class="flex items-center gap-4">
          <template v-if="authStore.isAuthenticated">
            <router-link to="/comics" class="text-white hover:text-gray-300">Comics</router-link>
            <button @click="handleLogout" class="text-white hover:text-gray-300">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="text-white hover:text-gray-300">Login</router-link>
            <router-link to="/register" class="text-white hover:text-gray-300">Register</router-link>
          </template>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      await authStore.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  </script>