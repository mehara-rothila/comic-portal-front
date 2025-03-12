// src/services/api.js
import axios from 'axios';
import router from '@/router';

// Use environment variables or default to localhost for development
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${backendUrl}/api`,
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: false
});

// Request interceptor
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Handle FormData requests
        if (config.data instanceof FormData) {
            // For FormData, let the browser set the Content-Type with boundary
            delete config.headers['Content-Type'];
        } else {
            config.headers['Content-Type'] = 'application/json';
        }

        // Log request details for debugging
        console.log('Request config:', {
            url: config.url,
            method: config.method,
            isFormData: config.data instanceof FormData,
            headers: config.headers
        });

        return config;
    },
    error => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    response => {
        // Log successful responses for debugging
        console.log('Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    error => {
        if (error.response) {
            // Log detailed error information
            console.error('Response error:', {
                url: error.config.url,
                status: error.response.status,
                data: error.response.data
            });

            switch (error.response.status) {
                case 401:
                    localStorage.removeItem('token');
                    router.push('/login');
                    break;
                case 403:
                    router.push('/');
                    break;
                case 422:
                    console.error('Validation errors:', error.response.data.errors || error.response.data);
                    break;
                case 500:
                    console.error('Server error:', error.response.data);
                    break;
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Request configuration error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

// Enhanced helper methods
api.uploadFile = async (endpoint, formData, options = {}) => {
    try {
        // Ensure formData is actually FormData
        if (!(formData instanceof FormData)) {
            throw new Error('Parameter must be an instance of FormData');
        }

        const response = await api.post(endpoint, formData, {
            ...options,
            headers: {
                ...options.headers,
                'Accept': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};

api.updateWithFormData = async (endpoint, formData, id, options = {}) => {
    try {
        if (!(formData instanceof FormData)) {
            throw new Error('Parameter must be an instance of FormData');
        }

        // Add method spoofing for PUT requests
        formData.append('_method', 'PUT');

        const response = await api.post(`${endpoint}/${id}`, formData, {
            ...options,
            headers: {
                ...options.headers,
                'Accept': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Update error:', error);
        throw error;
    }
};

api.formatError = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.response?.data?.error) {
        return error.response.data.error;
    }
    // Handle validation errors
    if (error.response?.data?.errors) {
        return Object.values(error.response.data.errors).flat().join(', ');
    }
    return error.message || 'An unexpected error occurred';
};

export default api;