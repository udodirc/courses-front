import { ref } from 'vue';
import api from '../api';

export function useRoles() {
    const roles = ref<{ id: number; name: string }[]>([]);
    const fetchRoles = async () => {
        try {
            const res = await api.get('/admin/roles');
            roles.value = res.data.data;
        } catch (e) {
            console.error('Ошибка загрузки ролей');
        }
    };

    return { roles, fetchRoles };
}