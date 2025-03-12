<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-md p-8">
        <div class="animate-pulse space-y-4">
          <div class="h-8 bg-gray-200 rounded w-1/2"></div>
          <div class="h-40 bg-gray-200 rounded"></div>
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error loading comic</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            <button 
              @click="fetchComic" 
              class="mt-2 text-sm text-red-600 hover:text-red-500 font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      </div>

      <!-- Comic Details -->
      <div v-else-if="comic" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="relative">
          <img 
            :src="comic.image || featuredImage" 
            :alt="comic.title"
            class="w-full h-96 object-cover"
            @error="handleImageError"
          >
          <div v-if="comic.featured" class="absolute top-4 right-4 bg-yellow-400 text-xs px-2 py-1 rounded-full">
            Featured
          </div>
        </div>

        <div class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ comic.title || 'My Hero Academia' }}</h1>
              <p class="text-lg text-gray-600 mt-2">By {{ comic.author || 'Kōhei Horikoshi' }}</p>
            </div>
            <span class="text-2xl font-bold text-blue-600">${{ formatPrice(comic.price) }}</span>
          </div>

          <div class="mt-6">
            <h2 class="text-xl font-semibold text-gray-900">Description</h2>
            <p class="mt-2 text-gray-600">{{ comic.description || 'Experience the epic journey of heroes in training at U.A. High School.' }}</p>
          </div>

          <div class="mt-6 flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full">{{ comic.genre || 'Action' }}</span>
              <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full">{{ comic.status || 'Ongoing' }}</span>
            </div>

            <!-- Admin Actions -->
            <div v-if="authStore.isAdmin" class="flex space-x-2">
              <button 
                @click="editComic"
                class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button 
                @click="confirmDelete"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="mt-6">
        <button 
          @click="router.back()"
          class="text-blue-600 hover:text-blue-800"
        >
          ← Back to Comics
        </button>
      </div>
    </div>

    <!-- Edit Modal -->
    <ComicFormModal 
      v-if="showEditModal"
      :comic="comic"
      @close="showEditModal = false"
      @submit="handleEditSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';
import ComicFormModal from '../components/ComicFormModal.vue';
import featuredImage from '../assets/comics/mha featured.jpg';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const comic = ref(null);
const loading = ref(true);
const error = ref(null);
const showEditModal = ref(false);

const formatPrice = (price) => {
  if (price === null || price === undefined || price === '') {
    return '0.00';
  }
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
};

const handleImageError = (event) => {
  event.target.src = featuredImage;
};

const fetchComic = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await api.get(`/comics/${props.id}`);
    comic.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load comic details';
    console.error('Error fetching comic:', err);
  } finally {
    loading.value = false;
  }
};

const editComic = () => {
  showEditModal.value = true;
};

const handleEditSubmit = async (updatedData) => {
  try {
    const response = await api.put(`/admin/comics/${comic.value.id}`, updatedData);
    comic.value = response.data;
    showEditModal.value = false;
  } catch (error) {
    console.error('Error updating comic:', error);
  }
};

const confirmDelete = async () => {
  if (!confirm('Are you sure you want to delete this comic?')) return;

  try {
    await api.delete(`/admin/comics/${comic.value.id}`);
    router.push('/comics');
  } catch (error) {
    console.error('Error deleting comic:', error);
  }
};

onMounted(() => {
  fetchComic();
});
</script>