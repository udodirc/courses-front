import { ref } from 'vue';
import api from '../api';
import { useErrorHandler } from './useErrorHandler';

export function useEntitySave<TForm extends Record<string, any>>() {
    const loading = ref(false);
    const { error, setError } = useErrorHandler();

    async function saveEntity(
        url: string,
        form: FormData,
        options?: { id?: number | string; headers?: Record<string, string> }
    ) {
        loading.value = true;
        error.value = null;

        try {
            if (options?.id) {
                await api.put(`${url}/${options.id}`, form, {
                    headers: options.headers || { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post(url, form, {
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