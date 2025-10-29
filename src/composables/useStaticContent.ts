// composables/useStaticContent.ts
import { ref } from 'vue';
import api from '../api';

export function useStaticContent() {
    const staticContent = ref<Record<string, string>>({});
    const loadingStatic = ref(false);
    const staticContentError = ref<string | null>(null);

    const fetchStaticContent = async (names: string[]) => {
        loadingStatic.value = true;
        staticContentError.value = null;
        try {
            const response = await api.post("/static_content", {
                names: names.map(name => ({ name })),
            });
            staticContent.value = response.data.data.reduce(
                (acc: Record<string, string>, item: { name: string; content: string }) => {
                    acc[item.name] = item.content;
                    return acc;
                },
                {}
            );
        } catch (e) {
            staticContentError.value = "Не удалось загрузить контент. Попробуйте позже.";
            staticContent.value = {};
        } finally {
            loadingStatic.value = false;
        }
    };

    return { staticContent, loadingStatic, staticContentError, fetchStaticContent };
}