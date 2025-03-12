// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import HomeView from '../views/HomeView.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ComicList from '../views/ComicList.vue';
import ComicDetail from '../views/ComicDetail.vue';
import MyComics from '../views/MyComics.vue';
import AdminPanel from '../views/AdminPanel.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/comics',
      name: 'comics',
      component: ComicList,
      meta: { requiresAuth: false }, // Changed to false to allow public access
    },
    {
      path: '/comics/:id',
      name: 'comic-detail',
      component: ComicDetail,
      meta: { requiresAuth: true },
      props: true
    },
    {
      path: '/my-comics',
      name: 'my-comics',
      component: MyComics,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPanel,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue')
    }
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const publicPages = ['/login', '/register', '/', '/comics'];
  const authRequired = !publicPages.includes(to.path);
  const adminRequired = to.meta.requiresAdmin;

  if (authRequired && !authStore.isAuthenticated) {
    return next('/login');
  }

  if (adminRequired && !authStore.isAdmin) {
    return next('/');
  }

  next();
});

export default router;