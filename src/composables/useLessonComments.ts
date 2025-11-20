import { ref } from 'vue';
import api from '../api';

export function useLessonComments() {
    const comments = ref<Record<number, any[]>>({});
    const loading = ref<Record<number, boolean>>({});
    const error = ref<Record<number, string | null>>({});

    // Определяем роль пользователя
    const role = localStorage.getItem('admin_data') ? 'admin' : 'partner';

    async function fetchComments(lessonId: number) {
        loading.value[lessonId] = true;
        error.value[lessonId] = null;

        try {
            const res = (role == 'partner')
                ? await api.get(`/partner/lesson-comment/${lessonId}`)
                : await api.get(`/admin/lesson-comment/lesson/${lessonId}`);

            let list = res.data?.data ?? res.data;

            // если это объект одного комментария → оборачиваем в массив
            if (list && !Array.isArray(list)) {
                list = [list];
            }

            comments.value[lessonId] = list;
        } catch (e: any) {
            error.value[lessonId] =
                e?.response?.data?.message || 'Ошибка загрузки комментариев';
            comments.value[lessonId] = [];
        } finally {
            loading.value[lessonId] = false;
        }
    }

    return {
        comments,
        loading,
        error,
        fetchComments,
    };
}