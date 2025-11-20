import { ref } from 'vue';
import api from '../api';

export function useLessonComments() {
    const comments = ref<Record<number, any[]>>({});
    const loading = ref<Record<number, boolean>>({});
    const error = ref<Record<number, string | null>>({});

    async function fetchComments(lessonId: number) {
        loading.value[lessonId] = true;
        error.value[lessonId] = null;

        try {
            const res = await api.get(`/partner/lesson-comment/${lessonId}`);
            comments.value[lessonId] = res.data.data || res.data;
        } catch (e: any) {
            error.value[lessonId] =
                e?.response?.data?.message || 'Ошибка загрузки комментариев';
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