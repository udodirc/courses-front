import { ref, type UnwrapRef } from 'vue';
import api from '../api';
import { useErrorHandler } from './useErrorHandler';

type SaveEntityOptions = {
    id?: number; // если передан — будет update (PUT), иначе create (POST)
    headers?: Record<string, string>;
};

export function useEntitySave<TForm extends Record<string, any>>() {
    const loading = ref(false);
    const { error, setError } = useErrorHandler();

    async function saveEntity(
        url: string,
        form: UnwrapRef<TForm> | FormData,
        options?: SaveEntityOptions
    ) {
        loading.value = true;
        error.value = null;

        try {
            if (options?.id) {
                const payload = form instanceof FormData ? Object.fromEntries(form) : form;
                await api.put(`${url}/${options.id}`, payload, {
                    headers: options?.headers || { 'Content-Type': 'application/json' },
                });
            } else {
                let data: FormData;
                if (form instanceof FormData) {
                    data = form;
                } else {
                    data = new FormData();
                    Object.entries(form as Record<string, any>).forEach(([key, value]) => {
                        if (value !== undefined && value !== null) data.append(key, value as any);
                    });
                }
                await api.post(url, data, {
                    headers: options?.headers || { 'Content-Type': 'multipart/form-data' },
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