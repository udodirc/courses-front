import { ref } from 'vue';

export function useErrorHandler() {
    const error = ref<string | Record<string, string[]> | null>(null);

    const setError = (e: any) => {
        const data = e?.response?.data;

        if (data?.errors && typeof data.errors === 'object') {
            // Laravel валидация (422)
            error.value = data.errors;
        } else if (data?.exception) {
            // Ошибка сервера (500, 403 и т.п.)
            error.value = data.exception;
        } else if (data?.message) {
            // Любая другая ошибка с message
            error.value = data.message;
        } else {
            error.value = 'Произошла неизвестная ошибка';
        }
    };

    const clearError = () => {
        error.value = null;
    };

    return { error, setError, clearError };
}