import { useRouter } from 'vue-router';

export function useCrudActions(baseRoute: string, deleteFn: (id: number) => Promise<void>) {
    const router = useRouter();

    const view = (id: number) => router.push(`${baseRoute}/${id}`);
    const edit = (id: number) => router.push(`${baseRoute}/${id}/edit`);
    const destroy = async (id: number) => {
        if (confirm('Удалить?')) await deleteFn(id);
    };

    return { view, edit, delete: destroy };
}