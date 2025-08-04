import { ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';

export function useRole() {
    const route = useRoute();
    const userId = Number(route.params.id);
    const role = ref<{ id: number; name: string } | null>(null);

    const fetchRole = async () => {
        try {
            const res = await api.get(`/admin/roles/${userId}`);
            role.value = res.data.data;
        } catch (e) {
            console.error('Ошибка загрузки роли');
        }
    };

    return { role, fetchRole };
}