import { ref } from 'vue';
import api from '../api';

export function useUsers() {
    const users = ref<{ id: number; name: string }[]>([]);
    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            users.value = res.data.data;
        } catch (e) {
            console.error('Ошибка загрузки пользователей');
        }
    };

    return { users, fetchUsers };
}