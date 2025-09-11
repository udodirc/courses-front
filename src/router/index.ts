import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/admin/auth/auth.store';

// Layout
import FrontendLayout from '../layouts/FrontendLayout.vue';
import DashboardLayout from '../layouts/DashboardLayout.vue';

const routes = [

    {
        path: '/',
        component: FrontendLayout,
        meta: { layout: 'front' },
        children: [
            {
                path: 'projects',
                name: 'FrontendProjects',
                component: () => import('../views/front/projects/Project.vue'),
            },
            {
                path: 'projects/:id',
                name: 'ProjectView',
                component: () => import('../views/front/projects/ProjectView.vue'),
            },
            {
                path: ':slug',
                name: 'FrontendPage',
                component: () => import('../views/front/Page.vue'),
                props: true,
            },
        ],
    },

    // Страницы без авторизации
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: () => import('../views/admin/Login.vue'),
    },

    // Защищённые страницы
    {
        path: '/admin',
        component: DashboardLayout,
        meta: { layout: 'admin', requiresAuth: true },
        children: [
            {
                path: 'dashboard',
                name: 'AdminDashboard',
                component: () => import('../views/admin/Dashboard.vue'),
            },
            {
                path: 'users',
                name: 'AdminUsers',
                component: () => import('../views/admin/user/Users.vue'),
            },
            {
                path: '/admin/users/:id',
                name: 'AdminUserShow',
                component: () => import('../views/admin/user/UserShow.vue'),
            },
            {
                path: '/admin/users/create',
                name: 'AdminUserCreate',
                component: () => import('../views/admin/user/UserCreate.vue'),
            },
            {
                path: 'users/:id/edit',
                name: 'AdminUserEdit',
                component: () => import('../views/admin/user/UserEdit.vue'),
            },
            {
                path: 'roles',
                name: 'AdminRoles',
                component: () => import('../views/admin/role/Roles.vue'),
            },
            {
                path: 'settings',
                name: 'AdminSettings',
                component: () => import('../views/admin/settings/Settings.vue'),
            },
            {
                path: '/admin/roles/:id',
                name: 'AdminRoleShow',
                component: () => import('../views/admin/role/RoleShow.vue'),
            },
            {
                path: '/admin/roles/create',
                name: 'AdminRoleCreate',
                component: () => import('../views/admin/role/RoleCreate.vue'),
            },
            {
                path: 'roles/:id/edit',
                name: 'AdminRoleEdit',
                component: () => import('../views/admin/role/RoleEdit.vue'),
            },
            {
                path: 'roles/assign-role',
                name: 'AdminAssignRole',
                component: () => import('../views/admin/role/AssignRole.vue'),
            },
            {
                path: 'permissions/give-permissions',
                name: 'AdminGivePermissions',
                component: () => import('../views/admin/permissions/GivePermissions.vue'),
            },
            {
                path: 'permissions/create-permissions',
                name: 'AdminCreatePermissions',
                component: () => import('../views/admin/permissions/CreatePermissions.vue'),
            },
            {
                path: 'menus',
                name: 'AdminMenus',
                component: () => import('../views/admin/menu/Menus.vue'),
            },
            {
                path: '/admin/menu/:id',
                name: 'AdminMenuShow',
                component: () => import('../views/admin/menu/MenuShow.vue'),
            },
            {
                path: '/admin/menu/create',
                name: 'AdminMenuCreate',
                component: () => import('../views/admin/menu/MenuCreate.vue'),
            },
            {
                path: 'menu/:id/edit',
                name: 'AdminMenuEdit',
                component: () => import('../views/admin/menu/MenuEdit.vue'),
            },
            {
                path: 'content',
                name: 'AdminContent',
                component: () => import('../views/admin/content/Content.vue'),
            },
            {
                path: '/admin/content/create',
                name: 'AdminContentCreate',
                component: () => import('../views/admin/content/ContentCreate.vue'),
            },
            {
                path: 'content/:id/edit',
                name: 'AdminContentEdit',
                component: () => import('../views/admin/content/ContentEdit.vue'),
            },
            {
                path: '/admin/content/:id',
                name: 'AdminContentShow',
                component: () => import('../views/admin/content/ContentShow.vue'),
            },
            {
                path: 'static-content',
                name: 'AdminStaticContent',
                component: () => import('../views/admin/static-content/StaticContent.vue'),
            },
            {
                path: '/admin/static_content/create',
                name: 'AdminStaticContentCreate',
                component: () => import('../views/admin/static-content/StaticContentCreate.vue'),
            },
            {
                path: 'static_content/:id/edit',
                name: 'AdminStaticContentEdit',
                component: () => import('../views/admin/static-content/StaticContentEdit.vue'),
            },
            {
                path: '/admin/static_content/:id',
                name: 'AdminStaticContentShow',
                component: () => import('../views/admin/static-content/StaticContentShow.vue'),
            },
            {
                path: 'projects',
                name: 'AdminProject',
                component: () => import('../views/admin/project/Projects.vue'),
            },
            {
                path: '/admin/project/create',
                name: 'AdminProjectCreate',
                component: () => import('../views/admin/project/ProjectCreate.vue'),
            },
            {
                path: 'project/:id/edit',
                name: 'AdminProjectEdit',
                component: () => import('../views/admin/project/ProjectEdit.vue'),
            },
            {
                path: '/admin/project/:id',
                name: 'AdminProjectShow',
                component: () => import('../views/admin/project/ProjectShow.vue'),
            },
        ],
    },

    // fallback
    // {
    //     path: '/:pathMatch(.*)*',
    //     redirect: '/admin/login',
    // },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 🔒 Защита маршрутов
router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();
    // Если у нас есть токен, но нет загруженного пользователя — загружаем
    if (auth.token && !auth.user) {
        try {
            await auth.fetchUser();
        } catch (e) {
            // Если токен невалидный — удаляем и перекидываем на логин
            auth.logout();
            return next('/admin/login');
        }
    }

    // Если маршрут требует авторизации, а пользователь не аутентифицирован — редирект
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return next('/admin/login');
    }
    // Всё ок — продолжаем
    next();
});

export default router;