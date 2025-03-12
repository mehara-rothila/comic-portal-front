// src/views/NotFound.vue
<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="max-w-xl w-full text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p class="text-2xl text-gray-600 mb-8">Page Not Found</p>
      <p class="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <router-link 
        to="/" 
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Go back home
      </router-link>
    </div>
  </div>
</template>

<script setup>
// No setup needed for this simple component
</script>