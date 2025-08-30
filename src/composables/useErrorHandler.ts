import { ref } from 'vue';

export function useErrorHandler() {
    const rawError = ref<Record<string, string[]> | string | null>(null);

    const setError = (e: any) => {
        const errors = e?.response?.data?.errors;
        if (errors && typeof errors === 'object') {
            rawError.value = errors;
        } else {
            const message = e?.response?.data?.message || 'Произошла ошибка';
            rawError.value = { general: [message] };
        }
    };

    return { error: rawError, setError };
}