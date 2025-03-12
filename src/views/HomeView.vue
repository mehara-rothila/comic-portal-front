<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-yellow-100 pt-16">
    <!-- Navigation Bar -->
    <nav class="bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <router-link to="/" class="text-2xl font-bold text-white">
            Comic<span class="text-yellow-900">Portal</span>
          </router-link>

          <!-- Navigation Links -->
          <div class="flex space-x-8">
            <router-link to="/" class="text-white hover:text-yellow-900 transition duration-200">
              <span class="font-medium">Home</span>
            </router-link>
            <!-- Categories Dropdown -->
            <div class="relative group">
              <button class="text-white hover:text-yellow-900 transition duration-200 flex items-center font-medium">
                Categories
                <span class="ml-1">▼</span>
              </button>
              <div class="absolute left-0 mt-0 pt-6 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible hover:opacity-100 hover:visible transition-all duration-300">
                <div class="bg-white w-48 rounded-md shadow-lg py-1">
                  <router-link
                    v-for="category in categories"
                    :key="category.id"
                    :to="'/comics?category=' + category.id"
                    class="block px-4 py-2 text-gray-900 hover:bg-yellow-50 hover:text-yellow-900 transition duration-200"
                  >
                    {{ category.name }}
                  </router-link>
                </div>
              </div>
            </div>
            <router-link to="/comics?sort=popular" class="text-white hover:text-yellow-900 transition duration-200 font-medium">
              Bestsellers
            </router-link>
            <router-link to="/comics?sort=new" class="text-white hover:text-yellow-900 transition duration-200 font-medium">
              New Arrivals
            </router-link>
          </div>

          <!-- Auth Buttons -->
          <div class="flex items-center space-x-4">
            <template v-if="!authStore.isAuthenticated">
              <router-link
                to="/login"
                class="text-yellow-900 bg-white hover:bg-yellow-100 px-4 py-2 rounded-md transition duration-200 font-medium"
              >
                Login
              </router-link>
              <router-link
                to="/register"
                class="text-white border-2 border-white hover:bg-white hover:text-yellow-900 px-4 py-2 rounded-md transition duration-200 font-medium"
              >
                Register
              </router-link>
            </template>
            <template v-else>
              <router-link
                to="/comics"
                class="text-white hover:text-yellow-900 transition duration-200 font-medium"
              >
                Browse Comics
              </router-link>
              <router-link
                to="/my-comics"
                class="text-white hover:text-yellow-900 transition duration-200 font-medium"
              >
                My Comics
              </router-link>
              <router-link
                v-if="authStore.isAdmin"
                to="/admin"
                class="text-yellow-900 bg-white hover:bg-yellow-100 px-4 py-2 rounded-md transition duration-200 font-medium"
              >
                Admin Panel
              </router-link>
              <button
                @click="handleLogout"
                :disabled="authStore.loading"
                class="text-white border-2 border-white hover:bg-white hover:text-yellow-900 px-4 py-2 rounded-md transition duration-200 font-medium"
              >
                {{ authStore.loading ? 'Logging out...' : 'Logout' }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-8 px-4">
      <!-- Loading State -->
      <div v-if="loading" class="h-[540px] bg-yellow-100 rounded-2xl animate-pulse flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <p class="text-red-700">{{ error }}</p>
      </div>
      
      <!-- Main Content Continued -->
      <div v-else>
        <!-- Featured Comics Carousel -->
        <div v-if="featuredComics.length > 0" class="mb-16">
          <Carousel
            :items-to-show="1"
            :wrap-around="true"
            :autoplay="4000"
            :transition="600"
            class="h-[540px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-500"
          >
            <Slide
              v-for="comic in featuredComics"
              :key="comic.id"
              class="h-full"
            >
              <div class="relative h-full flex items-center">
                <div class="w-1/2 p-16 flex flex-col justify-center">
                  <span class="text-white text-sm font-medium mb-4 bg-yellow-600 rounded-full px-4 py-1 inline-block">Featured</span>
                  <h2 class="text-5xl font-bold mb-6 text-white">{{ comic.title }}</h2>
                  <p class="mb-8 text-lg text-white/90 leading-relaxed">{{ comic.description }}</p>
                  <div class="flex items-center gap-6">
                    <span class="text-4xl font-bold text-white">${{ formatPrice(comic.price) }}</span>
                    <router-link
                      :to="'/comics/' + comic.id"
                      class="bg-white text-yellow-900 px-8 py-4 rounded-lg hover:bg-yellow-100 transition duration-300 font-semibold"
                    >
                      View Details
                    </router-link>
                  </div>
                </div>
                <div class="w-1/2 h-full relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-yellow-500/50 to-transparent z-10"></div>
                  <img
                    :src="getImageUrl(comic.image_url)"
                    :alt="comic.title"
                    class="absolute inset-0 w-full h-full object-cover"
                    @error="handleImageError"
                  />
                </div>
              </div>
            </Slide>
            <template #addons>
              <Navigation />
              <Pagination />
            </template>
          </Carousel>
        </div>

        <!-- Categories Grid -->
        <div class="mb-16">
          <h2 class="text-2xl font-bold text-yellow-900 mb-6">Browse Categories</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <router-link
              v-for="category in categories"
              :key="category.id"
              :to="'/comics?category=' + category.id"
              class="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div :class="['absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity', category.color]"></div>
              <div class="relative p-6">
                <h3 class="text-lg font-semibold text-yellow-900 group-hover:text-yellow-600 transition duration-300">
                  {{ category.name }}
                </h3>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Latest Comics Section -->
        <div class="mt-16">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-3xl font-bold text-yellow-900">Latest Comics</h2>
            <router-link
              to="/comics"
              class="text-yellow-600 hover:text-yellow-800 transition duration-200 flex items-center group"
            >
              View All
              <span class="ml-2 transition-transform duration-300 transform group-hover:translate-x-1">→</span>
            </router-link>
          </div>

          <!-- Comics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <router-link
              v-for="comic in comics"
              :key="comic.id"
              :to="'/comics/' + comic.id"
              class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div class="w-full h-64 bg-yellow-50 rounded-t-xl relative overflow-hidden">
                <img
                  :src="getImageUrl(comic.image_url)"
                  :alt="comic.title"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <div class="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 group-hover:opacity-0 transition duration-300"></div>
              </div>

              <div class="p-6">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-xl font-bold text-yellow-900 group-hover:text-yellow-600 transition duration-300">
                    {{ comic.title }}
                  </h3>
                  <span
                    v-if="comic.category_id"
                    class="text-xs px-2 py-1 rounded-full text-white"
                    :class="getCategoryColor(comic.category_id)"
                  >
                    {{ getCategoryName(comic.category_id) }}
                  </span>
                </div>
                <p class="text-yellow-700 text-sm mb-3">by {{ comic.author }}</p>
                <p class="text-yellow-600 text-sm line-clamp-2 mb-6">{{ comic.description }}</p>
                <div class="flex justify-between items-center">
                  <span class="text-2xl font-bold text-yellow-900">${{ formatPrice(comic.price) }}</span>
                  <span
                    v-if="comic.featured"
                    class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                  >
                    Featured
                  </span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'
import { categories } from '../config/categories'
import 'vue3-carousel/dist/carousel.css'
import api from '../services/api'

const router = useRouter()
const authStore = useAuthStore()

const comics = ref([])
const featuredComics = ref([])
const loading = ref(false)
const error = ref(null)

const handleImageError = (event) => {
  event.target.src = '/placeholder-comic.jpg'
}

const getImageUrl = (imageUrl) => {
  // Check if image URL exists
  if (!imageUrl) {
    return '/placeholder-comic.jpg';
  }
  
  // For absolute URLs (starting with http or https)
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // For images in the public directory (like /images/fallbacks/...)
  if (imageUrl.startsWith('/images/')) {
    // These need to be accessed directly from the backend
    return `http://localhost:8000${imageUrl}`;
  }
  
  // For storage URLs
  if (imageUrl.startsWith('/storage/')) {
    // These need to be accessed from the backend
    return `http://localhost:8000${imageUrl}`;
  }
  
  // For any other path starting with slash
  if (imageUrl.startsWith('/')) {
    return `http://localhost:8000${imageUrl}`;
  }
  
  // Default fallback for any other format
  return '/placeholder-comic.jpg';
}

const formatPrice = (price) => {
  if (price === null || price === undefined || price === '') return '0.00'
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00'
}

const getCategoryName = (categoryId) => {
  if (!categoryId) return 'Uncategorized'
  const numId = Number(categoryId)
  const category = categories.find(cat => cat.id === numId)
  return category ? category.name : 'Uncategorized'
}

const getCategoryColor = (categoryId) => {
  if (!categoryId) return 'bg-gray-100 text-gray-800'
  const numId = Number(categoryId)
  const category = categories.find(cat => cat.id === numId)
  return category ? category.color : 'bg-gray-100 text-gray-800'
}

const handleLogout = async () => {
  if (authStore.loading) return
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    const [comicsResponse, featuredResponse] = await Promise.all([
      api.get('/comics'),
      api.get('/comics/featured')
    ])

    comics.value = comicsResponse.data.map(comic => ({
      ...comic,
      category_id: comic.category_id ? Number(comic.category_id) : null,
      price: parseFloat(comic.price || 0)
    }))

    featuredComics.value = featuredResponse.data.map(comic => ({
      ...comic,
      category_id: comic.category_id ? Number(comic.category_id) : null,
      price: parseFloat(comic.price || 0)
    }))
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load data'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await fetchData()
  } catch (err) {
    error.value = 'Failed to initialize application'
  }
})
</script>

<style>
.carousel__slide { 
  height: 100%;
}

.carousel__viewport { 
  height: 100%;
}

.carousel__track { 
  height: 100%;
}

/* Fixed styles for the image container */
.carousel__slide .relative {
  height: 540px;
  width: 100%;
}

.carousel__slide .w-1/2 {
  height: 540px;
}

.carousel__slide .w-1/2.relative {
  position: relative;
  overflow: hidden;
}

/* Ensure images fill their containers properly */
.carousel__slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  position: absolute;
  inset: 0;
}

.carousel__pagination {
  margin-top: 1.5rem;
  position: relative;
  z-index: 20;
}

.carousel__pagination-button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  margin: 0 6px;
  transition: all 0.3s;
}

.carousel__pagination-button--active {
  background-color: white;
  transform: scale(1.2);
}

.carousel__prev,
.carousel__next {
  width: 48px;
  height: 48px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: all 0.3s;
  color: #000;
  font-weight: bold;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  z-index: 20;
}

.carousel__prev:hover,
.carousel__next:hover {
  opacity: 1;
  transform: scale(1.1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .carousel { 
    height: auto !important;
  }
  
  .carousel .flex { 
    flex-direction: column;
  }
  
  .carousel .w-1/2 { 
    width: 100%;
    height: 300px;
  }
  
  .carousel__prev,
  .carousel__next {
    width: 36px;
    height: 36px;
    font-size: 1.25rem;
  }
  
  .nav-download-btn { 
    display: none;
  }
}
</style>