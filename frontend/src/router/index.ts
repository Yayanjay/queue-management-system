import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/kiosk',
    },
    {
      path: '/kiosk',
      name: 'kiosk',
      component: () => import('@/views/CustomerKiosk.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/staff',
      name: 'staff',
      component: () => import('@/views/StaffDashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/display',
      name: 'display',
      component: () => import('@/views/DisplayScreen.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminSettings.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.loadFromStorage();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/staff');
  } else {
    next();
  }
});

export default router;
