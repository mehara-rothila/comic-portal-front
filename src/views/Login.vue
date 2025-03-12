<template>
  <div class="h-screen flex items-center justify-center bg-gradient-to-br from-white via-yellow-50 to-yellow-100 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full relative">
      <!-- Logo/Title -->
      <div class="text-center mb-6">
        <router-link to="/" class="text-3xl font-bold inline-block">
          Comic<span class="text-yellow-600">Portal</span>
        </router-link>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-xl shadow-xl p-6 space-y-4">
        <h2 class="text-2xl font-bold text-yellow-900 text-center">Welcome Back</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
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

          <div>
            <label class="block text-sm font-medium text-yellow-800 mb-1">Password</label>
            <input 
              type="password" 
              v-model="form.password" 
              required
              class="w-full px-4 py-2 rounded-lg border-2 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition-colors"
              placeholder="Enter your password"
            >
          </div>

          <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-3 rounded">
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>

          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2.5 px-4 rounded-lg text-sm font-medium text-yellow-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:bg-yellow-200 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
            <span v-else>Login</span>
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
            to="/register"
            class="text-sm text-yellow-600 hover:text-yellow-800 font-medium transition-colors"
          >
            Don't have an account? Register now
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const error = ref('')
const isLoading = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const handleSubmit = async () => {
  error.value = ''
  isLoading.value = true
  
  try {
    console.log('Attempting login with:', { email: form.email })
    await authStore.login(form)
    console.log('Login successful')
    router.push('/')
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.message || 'An error occurred during login. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>