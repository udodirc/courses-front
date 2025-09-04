import { useRouter } from 'vue-router';
import api from '../api';

export function useCrudActions(baseRoute: string, deleteFn: (id: number) => Promise<void>) {
    const router = useRouter();

    const view = (id: number) => router.push(`${baseRoute}/${id}`);
    const edit = (id: number) => router.push(`${baseRoute}/${id}/edit`);

    const toggleStatus = async (id: number) => {
        try {
            await api.post(`${baseRoute}/status/${id}`);
            return id;
        } catch (error) {
            console.error('Ошибка обновления статуса:', error);
            alert('Не удалось обновить статус');
            return null;
        }
    };

    const destroy = async (id: number) => {
        if (confirm('Удалить?')) await deleteFn(id);
    };

    return { view, edit, toggleStatus, delete: destroy };
}