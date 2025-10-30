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
            // === UPDATE ===
            if (options?.id) {
                // Если передан FormData — Laravel должен принять _method=PUT
                if (form instanceof FormData) {
                    form.append('_method', 'PUT'); // Laravel обработает как PUT
                    await api.post(`${url}/${options.id}`, form, {
                        headers: {
                            ...(options?.headers || {}),
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                } else {
                    // JSON-запрос
                    await api.put(`${url}/${options.id}`, form, {
                        headers: {
                            ...(options?.headers || {}),
                            'Content-Type': 'application/json',
                        },
                    });
                }
            }

            // === CREATE ===
            else {
                let data: FormData;

                if (form instanceof FormData) {
                    data = form;
                } else {
                    data = new FormData();
                    Object.entries(form as Record<string, any>).forEach(([key, value]) => {
                        if (value !== undefined && value !== null) {
                            data.append(key, value as any);
                        }
                    });
                }

                await api.post(url, data, {
                    headers: {
                        ...(options?.headers || {}),
                        'Content-Type': 'multipart/form-data',
                    },
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