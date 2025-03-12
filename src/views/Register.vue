<template>
  <div class="h-screen flex items-center justify-center bg-gradient-to-br from-white via-yellow-50 to-yellow-100 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full relative">
      <!-- Logo/Title -->
      <div class="text-center mb-6">
        <router-link to="/" class="text-3xl font-bold inline-block">
          Comic<span class="text-yellow-600">Portal</span>
        </router-link>
      </div>

      <!-- Register Card -->
      <div class="bg-white rounded-xl shadow-xl p-6 space-y-4">
        <h2 class="text-2xl font-bold text-yellow-900 text-center">Create Account</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name Field -->
          <div>
            <label class="block text-sm font-medium text-yellow-800 mb-1">Name</label>
            <input 
              type="text" 
              v-model="form.name" 
              required
              class="w-full px-4 py-2 rounded-lg border-2 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition-colors"
              placeholder="Enter your name"
            >
          </div>

          <!-- Email Field -->
          <div>
            <label class="block text-sm font-medium text-yellow-800 mb-1">Email</label>
            <input 
              type="email" 
              v-model="form.email" 
              required
              class="w-full px-4 py-2 rounded-lg border-2 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition-colors"
              placeholder="Enter your email"
            >
          </div>

          <!-- Password Field -->
          <div>
            <label class="block text-sm font-medium text-yellow-800 mb-1">Password</label>
            <input 
              type="password" 
              v-model="form.password" 
              required
              class="w-full px-4 py-2 rounded-lg border-2 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition-colors"
              placeholder="Create a password"
            >
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label class="block text-sm font-medium text-yellow-800 mb-1">Confirm Password</label>
            <input 
              type="password" 
              v-model="form.password_confirmation" 
              required
              class="w-full px-4 py-2 rounded-lg border-2 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition-colors"
              placeholder="Confirm your password"
            >
          </div>

          <!-- Error Messages -->
          <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-400 p-3 rounded">
            <p class="text-red-700 text-sm">{{ errorMessage }}</p>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            class="w-full flex justify-center py-2.5 px-4 rounded-lg text-sm font-medium text-yellow-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:bg-yellow-200 disabled:cursor-not-allowed transition-colors"
          >
            Register
          </button>
        </form>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-yellow-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-yellow-600">Or</span>
          </div>
        </div>

        <div class="text-center">
          <router-link 
            to="/login"
            class="text-sm text-yellow-600 hover:text-yellow-800 font-medium transition-colors"
          >
            Already have an account? Login
          </router-link>
        </div>
      </div>
    </div>

    <!-- Decorative elements -->
    <div class="absolute top-0 left-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
      <div class="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-yellow-200 to-yellow-400 opacity-20"></div>
    </div>
    <div class="absolute bottom-0 right-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
      <div class="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-yellow-400 to-yellow-200 opacity-20"></div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const errorMessage = ref('');

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const handleSubmit = async () => {
  if (form.password !== form.password_confirmation) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  try {
    await authStore.register(form);
    router.push('/comics');
  } catch (err) {
    if (err.message) {
      errorMessage.value = err.message;
    } else {
      errorMessage.value = 'Registration failed. Please try again.';
    }
  }
};
</script>