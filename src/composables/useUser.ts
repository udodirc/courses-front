import { ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';

export function useUser() {
    const route = useRoute(); // теперь вызов внутри функции — это корректно
    const userId = Number(route.params.id);
    const user = ref<{ id: number; name: string } | null>(null);

    const fetchUser = async () => {
        try {
            const res = await api.get(`/admin/users/${userId}`);
            user.value = res.data.data;
        } catch (e) {
            console.error('Ошибка загрузки пользователя');
        }
    };

    return { user, fetchUser };
}