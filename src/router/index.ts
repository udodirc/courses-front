import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/admin/auth/auth.store';
import { usePartnerStore } from '../store/client/partner.store';
import type { RouteRecordRaw } from 'vue-router';

// Layout
import FrontendLayout from '../layouts/FrontendLayout.vue';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import ClientLayout from '../layouts/ClientLayout.vue';

interface AppRouteMeta {
    layout?: string;
    requiresAuth?: boolean;
    superadmin?: boolean;
}

// Все маршруты
const routes: Array<RouteRecordRaw & { meta?: AppRouteMeta }> = [
    {
        path: '/email/verify-redirect',
        name: 'verify-email-redirect',
        component: () => import('../views/front/auth/VerifyEmailView.vue'),
    },

    {
        path: '/',
        component: FrontendLayout,
        meta: { layout: 'front' },
        children: [
            { path: 'projects', name: 'FrontendProjects', component: () => import('../views/front/projects/Project.vue') },
            { path: 'projects/:id', name: 'ProjectView', component: () => import('../views/front/projects/ProjectView.vue') },
            { path: ':slug', name: 'FrontendPage', component: () => import('../views/front/Page.vue'), props: true },
        ],
    },

    // Страницы без авторизации
    { path: '/admin/login', name: 'AdminLogin', component: () => import('../views/admin/Login.vue') },

    // Админка
    {
        path: '/admin',
        component: DashboardLayout,
        meta: { layout: 'admin', requiresAuth: true },
        children: [
            { path: 'profile', name: 'AdminProfile', component: () => import('../views/admin/user/Profile.vue') },
            { path: 'users', name: 'AdminUsers', component: () => import('../views/admin/user/Users.vue'), meta: { superadmin: true } },
            { path: '/admin/users/:id', name: 'AdminUserShow', component: () => import('../views/admin/user/UserShow.vue'), meta: { superadmin: true } },
            { path: '/admin/users/create', name: 'AdminUserCreate', component: () => import('../views/admin/user/UserCreate.vue'), meta: { superadmin: true } },
            { path: 'users/:id/edit', name: 'AdminUserEdit', component: () => import('../views/admin/user/UserEdit.vue'), meta: { superadmin: true } },
            { path: 'roles', name: 'AdminRoles', component: () => import('../views/admin/role/Roles.vue'), meta: { superadmin: true } },
            { path: 'settings', name: 'AdminSettings', component: () => import('../views/admin/settings/Settings.vue') },
            { path: '/admin/roles/:id', name: 'AdminRoleShow', component: () => import('../views/admin/role/RoleShow.vue'), meta: { superadmin: true } },
            { path: '/admin/roles/create', name: 'AdminRoleCreate', component: () => import('../views/admin/role/RoleCreate.vue'), meta: { superadmin: true } },
            { path: 'roles/:id/edit', name: 'AdminRoleEdit', component: () => import('../views/admin/role/RoleEdit.vue'), meta: { superadmin: true } },
            { path: 'roles/assign-role', name: 'AdminAssignRole', component: () => import('../views/admin/role/AssignRole.vue'), meta: { superadmin: true } },
            { path: 'permissions/give-permissions', name: 'AdminGivePermissions', component: () => import('../views/admin/permissions/GivePermissions.vue'), meta: { superadmin: true } },
            { path: 'permissions/create-permissions', name: 'AdminCreatePermissions', component: () => import('../views/admin/permissions/CreatePermissions.vue'), meta: { superadmin: true } },
            { path: 'partners', name: 'AdminPartners', component: () => import('../views/admin/partner/Partners.vue'), meta: { superadmin: true } },
            { path: 'partners/:id/edit', name: 'AdminPartnerEdit', component: () => import('../views/admin/partner/PartnerEdit.vue'), meta: { superadmin: true } },
            { path: '/admin/partners/:id', name: 'AdminPartnerShow', component: () => import('../views/admin/partner/PartnerShow.vue'), meta: { superadmin: true } },
            { path: 'menus', name: 'AdminMenus', component: () => import('../views/admin/menu/Menus.vue') },
            { path: '/admin/menu/:id', name: 'AdminMenuShow', component: () => import('../views/admin/menu/MenuShow.vue') },
            { path: '/admin/menu/create', name: 'AdminMenuCreate', component: () => import('../views/admin/menu/MenuCreate.vue') },
            { path: 'menu/:id/edit', name: 'AdminMenuEdit', component: () => import('../views/admin/menu/MenuEdit.vue') },
            { path: 'content', name: 'AdminContent', component: () => import('../views/admin/content/Content.vue') },
            { path: '/admin/content/create', name: 'AdminContentCreate', component: () => import('../views/admin/content/ContentCreate.vue') },
            { path: 'content/:id/edit', name: 'AdminContentEdit', component: () => import('../views/admin/content/ContentEdit.vue') },
            { path: '/admin/content/:id', name: 'AdminContentShow', component: () => import('../views/admin/content/ContentShow.vue') },
            { path: 'static-content', name: 'AdminStaticContent', component: () => import('../views/admin/static-content/StaticContent.vue') },
            { path: '/admin/static_content/create', name: 'AdminStaticContentCreate', component: () => import('../views/admin/static-content/StaticContentCreate.vue') },
            { path: 'static_content/:id/edit', name: 'AdminStaticContentEdit', component: () => import('../views/admin/static-content/StaticContentEdit.vue') },
            { path: '/admin/static_content/:id', name: 'AdminStaticContentShow', component: () => import('../views/admin/static-content/StaticContentShow.vue') },
            { path: 'projects', name: 'AdminProject', component: () => import('../views/admin/project/Projects.vue') },
            { path: '/admin/project/create', name: 'AdminProjectCreate', component: () => import('../views/admin/project/ProjectCreate.vue') },
            { path: 'project/:id/edit', name: 'AdminProjectEdit', component: () => import('../views/admin/project/ProjectEdit.vue') },
            { path: '/admin/project/:id', name: 'AdminProjectShow', component: () => import('../views/admin/project/ProjectShow.vue') },
        ],
    },

    {
        path: '/partner',
        component: ClientLayout,
        meta: { layout: 'partner', requiresAuth: true },
        children: [
            { path: 'profile', name: 'PartnerProfile', component: () => import('../views/client/partner/Profile.vue') }
        ],
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, _from, next) => {
    const auth = useAuthStore();
    const partner = usePartnerStore();

    // --- Партнёр ---
    if (to.path.startsWith('/')) {
        if (to.path.startsWith('/email/verify-redirect')) {
            return next()
        }

        if (partner.token && !partner.user) {
            try {
                await partner.fetchUser();
            } catch (e) {
                partner.logout();
                if (to.path !== '/') return next('/');
            }
        }

        if (!partner.isAuthenticated) {
            if (to.path !== '/') return next('/');
        } else if (to.path === '/partner') {
            // Если авторизован и пытается зайти на общий /partner → редирект на /partner/profile
            return next('/partner/profile');
        }
    }

    // --- Админ ---
    if (to.path.startsWith('/admin')) {
        if (auth.token && !auth.user) {
            try {
                await auth.fetchUser();
            } catch (e) {
                auth.logout();
                if (to.path !== '/admin/login') return next('/admin/login');
            }
        }

        if (!auth.isAuthenticated) {
            if (to.path !== '/admin/login') return next('/admin/login');
        }

        if (to.meta.superadmin && !auth.user?.is_superadmin) {
            if (to.path !== '/admin/content') return next('/admin/content');
        }

        return next();
    }

    // --- Любой другой маршрут (публичный) ---
    next();
});

import { computed } from 'vue';
export const visibleAdminRoutes = computed(() => {
    const auth = useAuthStore();
    const adminRoute = routes.find(r => r.path === '/admin');
    if (!adminRoute?.children) return [];

    return adminRoute.children.filter(route => {
        if (route.meta?.superadmin && !auth.user?.is_superadmin) return false;
        return true;
    });
});

export default router;