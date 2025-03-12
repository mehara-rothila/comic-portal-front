<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-gradient-to-b from-white to-yellow-50 p-4 rounded-lg w-[400px] shadow-2xl">
      <h2 class="text-lg font-bold mb-4 text-yellow-800 border-b-2 border-yellow-200 pb-2">
        {{ props.comic ? 'Edit Comic' : 'Add Comic' }}
      </h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="space-y-3">
          <!-- Cover Image Input -->
          <div>
            <label class="block text-yellow-800 font-medium mb-1 text-sm">Cover Image</label>
            <input 
              type="file"
              @change="handleImageChange"
              accept="image/*"
              class="w-full border-2 border-yellow-200 rounded-lg p-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none text-sm"
            >
            <p class="text-xs text-yellow-600 mt-1">Max size: 5MB. Formats: JPG, PNG. (Optional)</p>
            
            <!-- Image Preview -->
            <div v-if="imagePreview || (props.comic && props.comic.image_url && props.comic.image_url !== 'NULL')" class="mt-2">
              <img 
                :src="getPreviewUrl()" 
                class="w-full h-48 object-cover rounded-lg border-2 border-yellow-200"
                alt="Cover preview"
                @error="handleImageError($event)"
              >
            </div>
          </div>

          <!-- Title Input -->
          <div>
            <label class="block text-yellow-800 font-medium mb-1 text-sm">Title</label>
            <input 
              v-model.trim="formData.title" 
              type="text"
              class="w-full border-2 border-yellow-200 rounded-lg p-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none text-sm"
              required
              :placeholder="props.comic?.title || 'Enter title'"
            >
          </div>

          <!-- Author Input -->
          <div>
            <label class="block text-yellow-800 font-medium mb-1 text-sm">Author</label>
            <input 
              v-model.trim="formData.author" 
              type="text"
              class="w-full border-2 border-yellow-200 rounded-lg p-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none text-sm"
              required
              :placeholder="props.comic?.author || 'Enter author'"
            >
          </div>

          <!-- Genre Input -->
          <div>
            <label class="block text-yellow-800 font-medium mb-1 text-sm">Genre</label>
            <input 
              v-model.trim="formData.genre" 
              type="text"
              class="w-full border-2 border-yellow-200 rounded-lg p-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none text-sm"
              required
              :placeholder="props.comic?.genre || 'Enter genre'"
            >
          </div>

          <!-- Description Input -->
          <div>
            <label class="block text-yellow-800 font-medium mb-1 text-sm">Description</label>
            <textarea 
              v-model.trim="formData.description"
              rows="2"
              class="w-full border-2 border-yellow-200 rounded-lg p-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none text-sm"
              required
              :placeholder="props.comic?.description || 'Enter description'"
            ></textarea>
          </div>

          <!-- Category Select -->
          <div>
            <label class="block text-yellow-800 font-medium mb-1 text-sm">Category</label>
            <select 
              v-model.number="formData.category_id"
              class="w-full border-2 border-yellow-200 rounded-lg p-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none text-sm bg-white"
              required
            >
              <option value="" disabled>Select a category</option>
              <option
                v-for="category in categories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Price Input -->
          <div>
            <label class="block text-yellow-800 font-medium mb-1 text-sm">Price ($)</label>
            <input 
              v-model.number="formData.price"
              type="number"
              step="0.01"
              min="0"
              class="w-full border-2 border-yellow-200 rounded-lg p-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none text-sm"
              required
              :placeholder="pricePlaceholder"
            >
          </div>

          <!-- Status Select -->
          <div>
            <label class="block text-yellow-800 font-medium mb-1 text-sm">Status</label>
            <select 
              v-model="formData.status"
              class="w-full border-2 border-yellow-200 rounded-lg p-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none text-sm bg-white"
              required
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <!-- Featured Checkbox -->
          <div class="flex items-center gap-2 bg-yellow-50 p-2 rounded-lg">
            <input 
              type="checkbox"
              v-model="formData.featured"
              class="w-4 h-4 rounded border-2 border-yellow-300 text-yellow-500 focus:ring-yellow-200"
            >
            <label class="text-yellow-800 font-medium text-sm">Featured Comic</label>
          </div>
        </div>

        <!-- Form Buttons -->
        <div class="flex justify-end space-x-2 mt-4 pt-3 border-t border-yellow-200">
          <button 
            type="button" 
            @click="$emit('close')"
            class="px-4 py-1.5 rounded-lg border-2 border-yellow-200 text-yellow-700 hover:bg-yellow-50 text-sm"
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="px-4 py-1.5 rounded-lg bg-yellow-400 text-yellow-900 hover:bg-yellow-500 text-sm"
          >
            {{ props.comic ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { categories } from '../config/categories'

const props = defineProps({
  comic: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])

const formData = ref({
  title: '',
  author: '',
  description: '',
  genre: '',
  category_id: '',
  status: 'published',
  price: 0.00,
  featured: false
})

const imageFile = ref(null)
const imagePreview = ref('')

const getPreviewUrl = () => {
  if (imagePreview.value) {
    return imagePreview.value;
  }
  
  if (props.comic && props.comic.image_url && props.comic.image_url !== "NULL") {
    // Add backend URL prefix if it's a relative path
    if (props.comic.image_url.startsWith('/')) {
      return `http://localhost:8000${props.comic.image_url}`;
    }
    return props.comic.image_url;
  }
  
  return null;
};

const handleImageError = (event) => {
  event.target.src = '/placeholder-comic.jpg';
};

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Updated to 5MB (5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      event.target.value = ''
      return
    }
    imageFile.value = file
    if (imagePreview.value && !imagePreview.value.includes('http')) {
      URL.revokeObjectURL(imagePreview.value)
    }
    imagePreview.value = URL.createObjectURL(file)
  }
}

onMounted(() => {
  if (props.comic) {
    formData.value = {
      title: props.comic.title || '',
      author: props.comic.author || '',
      description: props.comic.description || '',
      genre: props.comic.genre || '',
      category_id: props.comic.category_id ? Number(props.comic.category_id) : '',
      status: props.comic.status || 'published',
      price: props.comic.price ? parseFloat(props.comic.price) : 0.00,
      featured: Boolean(props.comic.featured)
    }
  }
})

const pricePlaceholder = computed(() => {
  return props.comic ? parseFloat(props.comic.price).toFixed(2) : '0.00'
})

const handleSubmit = () => {
  const submitFormData = new FormData()
  
  // Add all form fields
  Object.keys(formData.value).forEach(key => {
    let value = formData.value[key]
    
    // Special handling for different types
    if (key === 'category_id') {
      value = value.toString()
    } else if (key === 'price') {
      value = Number(value).toFixed(2)
    } else if (key === 'featured') {
      value = value ? '1' : '0'
    }
    
    submitFormData.append(key, value)
  })
  
  if (imageFile.value) {
    submitFormData.append('image', imageFile.value)
  }
  
  if (props.comic && !imageFile.value && props.comic.image_url) {
    submitFormData.append('image_url', props.comic.image_url)
  }

  emit('submit', submitFormData)
}

onUnmounted(() => {
  if (imagePreview.value && !imagePreview.value.includes('http')) {
    URL.revokeObjectURL(imagePreview.value)
  }
})
</script>