// ComicCreate.vue
<template>
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Add New Comic</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block mb-1">Title</label>
          <input v-model="form.title" type="text" class="w-full p-2 border rounded" required>
        </div>
        
        <div>
          <label class="block mb-1">Author</label>
          <input v-model="form.author" type="text" class="w-full p-2 border rounded" required>
        </div>
  
        <div>
          <label class="block mb-1">Genre</label>
          <input v-model="form.genre" type="text" class="w-full p-2 border rounded" required>
        </div>
  
        <div>
          <label class="block mb-1">Description</label>
          <textarea v-model="form.description" rows="4" class="w-full p-2 border rounded" required></textarea>
        </div>

        <div>
          <label class="block mb-1">Price ($)</label>
          <input 
            v-model.number="form.price" 
            type="number" 
            step="0.01" 
            min="0" 
            class="w-full p-2 border rounded"
            placeholder="0.00"
          >
        </div>

        <div>
          <label class="block mb-1">Status</label>
          <select 
            v-model="form.status" 
            class="w-full p-2 border rounded" 
            required
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
  
        <div>
          <label class="block mb-1">Image URL</label>
          <input v-model="form.image" type="url" class="w-full p-2 border rounded">
        </div>

        <div class="flex items-center gap-2 mt-4">
          <input 
            type="checkbox" 
            v-model="form.featured" 
            class="rounded"
          >
          <label>Featured Comic</label>
        </div>
  
        <div class="flex gap-4 mt-6">
          <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Create
          </button>
          <button type="button" @click="router.back()" class="px-6 py-2 border rounded hover:bg-gray-100">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '../services/api';
  
  const router = useRouter();
  
  const form = reactive({
    title: '',
    author: '',
    genre: '',
    description: '',
    image: '',
    price: 0,
    status: 'published',
    featured: false
  });
  
  const handleSubmit = async () => {
    try {
      // Ensure price is a number
      const formData = {
        ...form,
        price: parseFloat(form.price) || 0,
        featured: Boolean(form.featured)
      };

      console.log('Submitting comic:', formData);
      await api.post('/comics', formData);
      router.push('/comics');
    } catch (error) {
      console.error('Error creating comic:', error);
    }
  };
  </script>