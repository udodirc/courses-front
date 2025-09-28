// shims-vue.d.ts

// Для всех Vue компонентов
declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// Для сторонних модулей, которые не имеют типов
declare module '@vueuse/head';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';
declare module '*.css';
declare module '*.scss';
declare module '*.sass';