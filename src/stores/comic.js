// src/stores/comic.js
import { defineStore } from 'pinia'
import api from '../services/api'

export const useComicStore = defineStore('comic', {
  state: () => ({
    comics: [],
    categories: [],
    featuredComics: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchComics(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/comics', { params })
        this.comics = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch comics'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        const response = await api.get('/categories')
        this.categories = response.data
        return response.data
      } catch (error) {
        console.error('Error fetching categories:', error)
        throw error
      }
    },

    async fetchFeaturedComics() {
      try {
        const response = await api.get('/comics/featured')
        this.featuredComics = response.data
        return response.data
      } catch (error) {
        console.error('Error fetching featured comics:', error)
        throw error
      }
    },

    async getComicById(id) {
      try {
        const response = await api.get(`/comics/${id}`)
        return response.data
      } catch (error) {
        console.error('Error fetching comic:', error)
        throw error
      }
    }
  }
})