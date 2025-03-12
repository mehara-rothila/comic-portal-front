# src/views/MyComics.vue

<template>
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">My Comics</h1>
        <button 
          @click="openModal()"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Comic
        </button>
      </div>
  
      <!-- Comics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="comic in comics" :key="comic.id" class="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            v-if="comic.image" 
            :src="comic.image" 
            :alt="comic.title"
            class="w-full h-48 object-cover"
          >
          <div class="p-4">
            <h3 class="text-xl font-semibold mb-2">{{ comic.title }}</h3>
            <p class="text-gray-600 mb-2">Author: {{ comic.author }}</p>
            <p class="text-gray-600 mb-2">Genre: {{ comic.genre }}</p>
            <p class="text-gray-700 mb-4 line-clamp-3">{{ comic.description }}</p>
            <div class="flex justify-end gap-2">
              <button 
                @click="openModal(comic)"
                class="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button 
                @click="confirmDelete(comic)"
                class="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg w-full max-w-md p-6">
          <h2 class="text-xl font-bold mb-4">{{ editingComic ? 'Edit Comic' : 'Add New Comic' }}</h2>
          <form @submit.prevent="saveComic">
            <div class="space-y-4">
              <div>
                <label class="block text-gray-700 mb-1">Title</label>
                <input 
                  v-model="comicForm.title" 
                  type="text"
                  required
                  class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Author</label>
                <input 
                  v-model="comicForm.author" 
                  type="text"
                  required
                  class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Genre</label>
                <input 
                  v-model="comicForm.genre" 
                  type="text"
                  required
                  class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Image URL</label>
                <input 
                  v-model="comicForm.image" 
                  type="text"
                  class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-gray-700 mb-1">Description</label>
                <textarea 
                  v-model="comicForm.description"
                  required
                  rows="3"
                  class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
            <div class="flex justify-end gap-2 mt-6">
              <button 
                type="button"
                @click="showModal = false"
                class="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {{ editingComic ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const comics = ref([])
const showModal = ref(false)
const editingComic = ref(null)
const comicForm = ref({
  title: '',
  author: '',
  genre: '',
  description: '',
  image: ''
})

// Debug function to check authentication status
const checkAuth = () => {
  console.log('Auth Status:', {
    isAuthenticated: authStore.isAuthenticated,
    token: localStorage.getItem('token'),
    user: authStore.user
  })
}

// Fetch user's comics
const fetchComics = async () => {
  try {
    checkAuth() // Debug auth status
    console.log('Fetching comics...')
    const response = await api.get('/user/comics', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log('Comics response:', response.data)
    comics.value = response.data
  } catch (error) {
    console.error('Error fetching comics:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    })
    if (error.response?.status === 401) {
      authStore.clearAuth()
    }
  }
}

// Save comic (create or update)
const saveComic = async () => {
  try {
    checkAuth() // Debug auth status
    if (!authStore.isAuthenticated) {
      throw new Error('You must be logged in to perform this action')
    }

    // Log the form data being sent
    console.log('Saving comic with data:', comicForm.value)

    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }

    if (editingComic.value) {
      await api.put(`/comics/${editingComic.value.id}`, comicForm.value, config)
    } else {
      await api.post('/comics', comicForm.value, config)
    }
    await fetchComics()
    showModal.value = false
    
    // Reset form after successful save
    comicForm.value = {
      title: '',
      author: '',
      genre: '',
      description: '',
      image: ''
    }
  } catch (error) {
    console.error('Error saving comic:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers
    })
    if (error.response?.status === 401) {
      authStore.clearAuth()
    }
  }
}

// Open modal for create/edit
const openModal = (comic = null) => {
  if (comic) {
    editingComic.value = comic
    comicForm.value = { ...comic }
  } else {
    editingComic.value = null
    comicForm.value = {
      title: '',
      author: '',
      genre: '',
      description: '',
      image: ''
    }
  }
  showModal.value = true
}

// Delete comic
const confirmDelete = async (comic) => {
  if (confirm(`Are you sure you want to delete "${comic.title}"?`)) {
    try {
      checkAuth() // Debug auth status
      await api.delete(`/comics/${comic.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      await fetchComics()
    } catch (error) {
      console.error('Error deleting comic:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.config?.headers
      })
      if (error.response?.status === 401) {
        authStore.clearAuth()
      }
    }
  }
}

onMounted(() => {
  checkAuth() // Debug auth status on mount
  if (authStore.isAuthenticated) {
    fetchComics()
  } else {
    console.warn('User not authenticated on component mount')
  }
})
</script>