import { ref } from 'vue';
import api from '../api';
import { useErrorHandler } from './useErrorHandler';

export function useEntitySave<TForm extends Record<string, any>>() {
    const loading = ref(false);
    const { error, setError } = useErrorHandler();

    async function saveEntity(url: string, form: TForm, id?: number) {
        loading.value = true;
        error.value = null;

        try {
            if (id) {
                await api.put(`${url}/${id}`, form);
            } else {
                await api.post(url, form);
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