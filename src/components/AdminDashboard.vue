// src/components/AdminDashboard.vue
<template>
  <div class="p-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Total Comics</h3>
        <p class="text-3xl font-bold">{{ stats.totalComics }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Total Users</h3>
        <p class="text-3xl font-bold">{{ stats.totalUsers }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Published Comics</h3>
        <p class="text-3xl font-bold">{{ stats.publishedComics }}</p>
      </div>
    </div>

    <!-- Comics Table -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 flex justify-between items-center">
        <h2 class="text-xl font-semibold">Comics Management</h2>
        <button @click="openComicForm(null)" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add New Comic
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Genre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="comic in comics" :key="comic.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">{{ comic.title }}</td>
              <td class="px-6 py-4">{{ comic.author }}</td>
              <td class="px-6 py-4">{{ comic.genre }}</td>
              <td class="px-6 py-4">${{ formatPrice(comic.price) }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(comic.status)">
                  {{ comic.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button @click="openComicForm(comic)" class="text-blue-600 hover:text-blue-900 mr-3">
                  Edit
                </button>
                <button @click="confirmDelete(comic.id)" class="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Comic Form Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">{{ selectedComic ? 'Edit Comic' : 'Add New Comic' }}</h2>
        <form @submit.prevent="saveComic">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Title</label>
            <input v-model="formData.title" type="text" class="w-full border rounded p-2" required>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Author</label>
            <input v-model="formData.author" type="text" class="w-full border rounded p-2" required>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea v-model="formData.description" class="w-full border rounded p-2" rows="3" required></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Genre</label>
            <input v-model="formData.genre" type="text" class="w-full border rounded p-2" required>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Price ($)</label>
            <input 
              v-model.number="formData.price"
              type="number"
              step="0.01"
              min="0"
              class="w-full border rounded p-2"
              placeholder="0.00"
            >
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Status</label>
            <select v-model="formData.status" class="w-full border rounded p-2">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div class="flex items-center mb-4">
            <input 
              type="checkbox"
              v-model="formData.featured"
              class="mr-2"
            >
            <label class="text-sm font-medium">Featured Comic</label>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" @click="closeModal" class="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              {{ selectedComic ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const comics = ref([]);
const stats = ref({
  totalComics: 0,
  totalUsers: 0,
  publishedComics: 0
});
const showModal = ref(false);
const selectedComic = ref(null);
const formData = ref({
  title: '',
  author: '',
  description: '',
  genre: '',
  status: 'draft',
  price: 0,
  featured: false
});

const formatPrice = (price) => {
  return typeof price === 'number' ? price.toFixed(2) : '0.00';
};

const getStatusClass = (status) => {
  return {
    'published': 'text-green-600',
    'draft': 'text-yellow-600'
  }[status] || 'text-gray-600';
};

const fetchStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    stats.value = response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};

const fetchComics = async () => {
  try {
    const response = await api.get('/admin/comics');
    comics.value = response.data;
  } catch (error) {
    console.error('Error fetching comics:', error);
  }
};

const openComicForm = (comic) => {
  selectedComic.value = comic;
  if (comic) {
    formData.value = { 
      ...comic,
      price: parseFloat(comic.price) || 0,
      featured: Boolean(comic.featured)
    };
  } else {
    formData.value = {
      title: '',
      author: '',
      description: '',
      genre: '',
      status: 'draft',
      price: 0,
      featured: false
    };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedComic.value = null;
};

const saveComic = async () => {
  try {
    const comicData = {
      ...formData.value,
      price: parseFloat(formData.value.price) || 0,
      featured: Boolean(formData.value.featured)
    };

    if (selectedComic.value) {
      await api.put(`/admin/comics/${selectedComic.value.id}`, comicData);
    } else {
      await api.post('/admin/comics', comicData);
    }
    await fetchComics();
    await fetchStats();
    closeModal();
  } catch (error) {
    console.error('Error saving comic:', error);
  }
};

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this comic?')) {
    try {
      await api.delete(`/admin/comics/${id}`);
      await fetchComics();
      await fetchStats();
    } catch (error) {
      console.error('Error deleting comic:', error);
    }
  }
};

onMounted(() => {
  fetchComics();
  fetchStats();
});
</script>