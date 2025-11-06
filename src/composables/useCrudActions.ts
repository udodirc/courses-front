import { useRouter } from 'vue-router';
import api from '../api';

export function useCrudActions(
    baseRoute: string,
    deleteFn: (id: number) => Promise<void>,
    emit?: (event: any, ...args: any[]) => void
) {
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

    const toggleFreePay = async (id: number) => {
        try {
            await api.post(`${baseRoute}/free-pay/${id}`);
            return id;
        } catch (error) {
            console.error('Ошибка обновления статуса бесплатного урока:', error);
            alert('Не удалось обновить статус бесплатного урока');
            return null;
        }
    };

    const changeOrder = async (id: number, direction: 'up' | 'down') => {
        try {
            await api.post(`${baseRoute}/order/${id}/${direction}`);
            return id;
        } catch (error) {
            console.error('Ошибка обновления порядка:', error);
            alert('Не удалось обновить порядок');
            return null;
        }
    };

    const destroy = async (id: number) => {
        if (confirm('Удалить?')) await deleteFn(id);
    };

    const payment = (id: number) => {
        emit?.('payment', id);
    };

    return { view, edit, toggleStatus, toggleFreePay, changeOrder, delete: destroy, payment };
}