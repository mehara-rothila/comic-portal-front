<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-yellow-50">
    <header class="bg-yellow-500 text-white shadow-lg">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold">Admin Dashboard</h1>
      </div>
    </header>
 
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
      </div>
 
      <div v-else>
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-yellow-400">
            <h2 class="text-xl font-semibold mb-2 text-yellow-800">Total Comics</h2>
            <p class="text-3xl text-yellow-600">{{ stats.totalComics }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-yellow-400">
            <h2 class="text-xl font-semibold mb-2 text-yellow-800">Total Users</h2>
            <p class="text-3xl text-yellow-600">{{ stats.totalUsers }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-yellow-400">
            <h2 class="text-xl font-semibold mb-2 text-yellow-800">Published Comics</h2>
            <p class="text-3xl text-yellow-600">{{ stats.publishedComics }}</p>
          </div>
        </div>
 
        <!-- Comics Management Section -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="p-6 border-b border-yellow-200">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-semibold text-yellow-800">Manage Comics</h2>
              <button 
                @click="handleAddNewClick"
                class="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-6 py-2.5 rounded-lg transition duration-200 font-medium"
              >
                Add New Comic
              </button>
            </div>
          </div>
          
          <!-- Error Message -->
          <div v-if="error" class="mx-6 mt-4">
            <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <div class="flex">
                <div class="ml-3">
                  <p class="text-red-700">{{ error }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Comics Table -->
          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-yellow-200">
                <thead class="bg-yellow-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Cover & Title</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Author</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Genre</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Category</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Price</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-yellow-800 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-yellow-100">
                  <tr v-for="comic in comics" :key="comic.id" class="hover:bg-yellow-50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center space-x-2">
                        <!-- Cover Image -->
                        <img 
                          v-if="comic.image_url && comic.image_url !== 'NULL'" 
                          :src="getImageUrl(comic.image_url)" 
                          class="w-10 h-10 object-cover rounded"
                          :alt="comic.title"
                          @error="handleImageError($event)"
                        />
                        <div v-else class="w-10 h-10 bg-yellow-100 flex items-center justify-center rounded">
                          <span class="text-yellow-800 text-xs">No image</span>
                        </div>
                        <div class="font-medium text-gray-900">{{ comic.title }}</div>
                        <span v-if="comic.featured" 
                              class="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Featured
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4">{{ comic.author }}</td>
                    <td class="px-6 py-4">{{ comic.genre }}</td>
                    <td class="px-6 py-4">
                      <span 
                        class="px-2 py-0.5 text-xs font-medium rounded-full inline-block"
                        :class="[getCategoryColor(comic.category_id)]"
                      >
                        {{ getCategoryName(comic.category_id) }}
                      </span>
                    </td>
                    <td class="px-6 py-4">${{ formatPrice(comic.price) }}</td>
                    <td class="px-6 py-4">
                      <span 
                        :class="[
                          'px-2 py-1 rounded-full text-xs font-medium',
                          comic.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        ]"
                      >
                        {{ comic.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right space-x-3">
                      <button 
                        @click="editComic(comic)"
                        class="text-yellow-600 hover:text-yellow-900 font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        @click="confirmDelete(comic)"
                        class="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
 
    <!-- Comic Form Modal -->
    <ComicFormModal 
      v-if="showAddComicForm"
      :comic="selectedComic"
      @close="closeComicForm"
      @submit="saveComic"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import ComicFormModal from '../components/ComicFormModal.vue';
import { categories } from '../config/categories';

const router = useRouter();
const comics = ref([]);
const stats = ref({
  totalComics: 0,
  totalUsers: 0,
  publishedComics: 0
});
const showAddComicForm = ref(false);
const selectedComic = ref(null);
const loading = ref(true);
const error = ref(null);

// Image handling
const getImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl === "NULL") return null;
  
  // Add the backend URL prefix if it's a relative path
  if (imageUrl.startsWith('/')) {
    return `http://localhost:8000${imageUrl}`;
  }
  
  // Return as is if it's already a full URL
  return imageUrl;
};

const handleImageError = (event) => {
  // Replace broken images with a placeholder
  event.target.src = '/placeholder-comic.jpg';
};

// Category helpers
const getCategoryName = (categoryId) => {
  if (!categoryId) return 'Uncategorized';
  const numId = Number(categoryId);
  const category = categories.find(cat => cat.id === numId);
  return category ? category.name : 'Uncategorized';
};

const getCategoryColor = (categoryId) => {
  if (!categoryId) return 'bg-gray-100 text-gray-800';
  const numId = Number(categoryId);
  const category = categories.find(cat => cat.id === numId);
  return category ? `${category.color} text-white` : 'bg-gray-100 text-gray-800';
};

const formatPrice = (price) => {
  if (!price) return '0.00';
  return parseFloat(price).toFixed(2);
};

const fetchData = async () => {
  try {
    error.value = null;
    loading.value = true;

    const [comicsRes, statsRes] = await Promise.all([
      api.get('/admin/comics'),
      api.get('/admin/stats')
    ]);

    comics.value = comicsRes.data.map(comic => ({
      ...comic,
      category_id: comic.category_id ? Number(comic.category_id) : null,
      price: parseFloat(comic.price || 0)
    }));

    stats.value = {
      ...stats.value,
      ...statsRes.data
    };
  } catch (err) {
    console.error('Error fetching data:', err);
    error.value = 'Failed to load data. Please try again.';
    if (err.response?.status === 403) {
      router.push('/');
    }
  } finally {
    loading.value = false;
  }
};

const handleAddNewClick = () => {
  selectedComic.value = null;
  showAddComicForm.value = true;
};

const editComic = (comic) => {
  console.log('Editing comic:', comic);
  selectedComic.value = {
    ...comic,
    category_id: comic.category_id ? Number(comic.category_id) : null,
    price: parseFloat(comic.price || 0),
    featured: Boolean(comic.featured)
  };
  console.log('Prepared comic for edit:', selectedComic.value);
  showAddComicForm.value = true;
};

const confirmDelete = async (comic) => {
  if (window.confirm('Are you sure you want to delete this comic?')) {
    try {
      error.value = null;
      await api.delete(`/admin/comics/${comic.id}`);
      await fetchData();
    } catch (err) {
      console.error('Error deleting comic:', err);
      error.value = 'Failed to delete comic. Please try again.';
    }
  }
};

const closeComicForm = () => {
  showAddComicForm.value = false;
  selectedComic.value = null;
};

const saveComic = async (formData) => {
  try {
    error.value = null;
    let response;

    if (selectedComic.value) {
      // For edit/update
      formData.append('_method', 'PUT');
      // Log the form data for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      response = await api.post(`/admin/comics/${selectedComic.value.id}`, formData);
    } else {
      // For create
      response = await api.post('/admin/comics', formData);
    }

    showAddComicForm.value = false;
    await fetchData();
  } catch (err) {
    console.error('Save error:', err);
    error.value = err.response?.data?.message || 'Failed to save comic';
  }
};

onMounted(fetchData);
</script>