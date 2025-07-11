// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/admin/auth/auth.store.ts';

const routes = [
    { path: '/admin/login', component: () => import('../views/admin/Login.vue') },
    { path: '/admin/dashboard', component: () => import('../views/admin/Dashboard.vue'), meta: { requiresAuth: true } },
    // другие маршруты
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const auth = useAuthStore();
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next('/admin/login');
    } else {
        next();
    }
});

export default router;