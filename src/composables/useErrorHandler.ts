import { ref } from 'vue';

export function useErrorHandler() {
    const rawError = ref<Record<string, string[]> | null>(null);

    const setError = (e: any) => {
        const data = e?.response?.data;

        if (data?.errors && typeof data.errors === 'object') {
            // Ошибки валидации (422)
            rawError.value = data.errors;
        } else if (data?.exception) {
            // Ошибки сервера (500, 403 и т.п.)
            rawError.value = {
                general: [data.exception],
            };
        } else if (data?.message) {
            // Если есть только message
            rawError.value = {
                general: [data.message],
            };
        } else {
            // fallback
            rawError.value = {
                general: ['Произошла неизвестная ошибка'],
            };
        }
    };

    return { error: rawError, setError };
}