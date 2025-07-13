// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/admin/auth/auth.store';

// Layout
import DashboardLayout from '../layouts/DashboardLayout.vue';

const routes = [
    // Страницы без авторизации (например, логин)
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: () => import('../views/admin/Login.vue'),
    },

    // Защищённые страницы
    {
        path: '/admin',
        component: DashboardLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: 'dashboard',
                name: 'AdminDashboard',
                component: () => import('../views/admin/Dashboard.vue'),
            },
            {
                path: 'users',
                name: 'AdminUsers',
                component: () => import('../views/admin/Users.vue'),
            },
            {
                path: 'settings',
                name: 'AdminSettings',
                component: () => import('../views/admin/Settings.vue'),
            },
        ],
    },

    // fallback
    {
        path: '/:pathMatch(.*)*',
        redirect: '/admin/login',
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 🔒 Защита маршрутов
router.beforeEach((to, from, next) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return next('/admin/login');
    }

    next();
});

export default router;