import { ref } from 'vue';
import api from '../api';
import { useErrorHandler } from './useErrorHandler';

export function useEntitySave<TForm extends Record<string, any>>() {
    const loading = ref(false);
    const { error, setError } = useErrorHandler();

    async function saveEntity(
        url: string,
        form: TForm | FormData,
        options?: { id?: number | string; headers?: Record<string, string> }
    ) {
        loading.value = true;
        error.value = null;

        const data = form instanceof FormData ? form : new FormData();
        if (!(form instanceof FormData)) {
            Object.entries(form).forEach(([key, value]) => {
                data.append(key, value as any);
            });
        }

        try {
            if (options?.id) {
                await api.put(`${url}/${options.id}`, data, {
                    headers: options?.headers || { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post(url, data, {
                    headers: options?.headers || { 'Content-Type': 'multipart/form-data' }
                });
            }
        } catch (e: any) {
            setError(e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    return { saveEntity, loading, error };
}