import { ref } from 'vue';

export function useErrorHandler() {
    const error = ref<Record<string, string[]> | string>('');
    const setError = (e: any) => {
        const errors = e?.response?.data?.errors;
        if (errors && typeof errors === 'object') {
            error.value = errors;
        } else {
            error.value = { general: ['Произошла ошибка'] };
        }
    };

    return { error, setError };
}