import { ref } from 'vue';
import api from '../api';

export function useMenus() {
    const menus = ref<{ id: number; name: string }[]>([]);
    const fetchMenus = async () => {
        try {
            const res = await api.get('/admin/menu');
            menus.value = res.data.data;
        } catch (e) {
            console.error('Ошибка загрузки меню');
        }
    };

    return { menus, fetchMenus };
}