<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-yellow-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-yellow-900 mb-8">Comic Collection</h1>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <p class="text-red-700">{{ error }}</p>
        <button 
          @click="fetchData" 
          class="mt-2 text-sm text-red-600 hover:text-red-500 font-medium"
        >
          Try again
        </button>
      </div>

      <!-- No Comics Found -->
      <div v-else-if="comics && comics.length === 0" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">No Comics Found</h3>
            <p class="text-sm text-yellow-700 mt-1">No comics were found for this category.</p>
          </div>
        </div>
      </div>

      <!-- Comics Grid -->
      <div v-else-if="comics && comics.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="comic in comics" 
          :key="comic.id" 
          class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
        >
          <div class="relative">
            <div v-if="comic.featured" class="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full text-white font-medium">
              Featured
            </div>
            <img 
              :src="getComicImage(comic)" 
              :alt="comic.title"
              class="w-full h-48 object-cover rounded-t-xl"
              @error="handleImageError"
            >
          </div>
          
          <div class="p-4">
            <h2 class="text-xl font-semibold text-yellow-900 group-hover:text-yellow-600 transition duration-300 mb-2">
              {{ comic.title }}
            </h2>
            <p class="text-yellow-700 text-sm mb-2">by {{ comic.author || 'Unknown Author' }}</p>
            <p class="text-yellow-600 text-sm line-clamp-2 mb-4">{{ comic.description }}</p>
            
            <div class="flex justify-between items-center">
              <span class="text-xl font-bold text-yellow-900">${{ formatPrice(comic.price) }}</span>
              <router-link 
                :to="{ name: 'comic-detail', params: { id: comic.id }}"
                class="bg-yellow-400 text-yellow-900 px-4 py-2 rounded hover:bg-yellow-500 transition duration-200 font-medium"
              >
                View
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const comics = ref([])
const loading = ref(true)
const error = ref(null)

const handleImageError = (event) => {
  event.target.src = '/placeholder-comic.jpg'
}

const getComicImage = (comic) => {
  // Check if comic has a valid image_url
  if (comic.image_url && comic.image_url !== "NULL") {
    // Add backend URL prefix if it's a relative path
    if (comic.image_url.startsWith('/')) {
      return `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}${comic.image_url}`;
    } else if (comic.image_url.startsWith('http')) {
      return comic.image_url;
    }
  }
  
  // Default fallback
  return '/placeholder-comic.jpg';
}

const formatPrice = (price) => {
  if (price === null || price === undefined || price === '') return '0.00'
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00'
}

const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const categoryId = route.query.category
    let response
    
    if (categoryId) {
      // Use the correct endpoint format
      response = await api.get(`/comics/by-category/${categoryId}`)
    } else {
      response = await api.get('/comics')
    }
    
    comics.value = response.data.map(comic => ({
      ...comic,
      price: parseFloat(comic.price || 0)
    }))
    console.log('Fetched comics:', comics.value)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load comics'
    console.error('Error fetching comics:', err)
  } finally {
    loading.value = false
  }
}

// Watch for changes in the category query parameter
watch(
  () => route.query.category,
  (newCategory) => {
    console.log('Category changed to:', newCategory)
    fetchData()
  }
)

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

