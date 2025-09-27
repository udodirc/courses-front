import { computed } from 'vue';
import { StaticContentApi } from '../../../api/admin/static_content/static_content.api';
import type { StaticContent } from '../../../types/StaticContent';
import type { CreateStaticContentDto } from '../../../dto/static_content.dto.ts';
import { BaseStore } from '../../BaseStore';

class StaticContentStore extends BaseStore<CreateStaticContentDto, StaticContent> {
    public storeId = 'admin-static-content';
    public api = new StaticContentApi();
}

const staticContentStore = new StaticContentStore();

export const useStaticContentStore = staticContentStore.getStore(staticContentStore.api);

export function useStaticContentStoreWithGetters() {
    const store = useStaticContentStore();

    const staticContentList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: true,
        }))
    );

    const currentStaticContent = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        staticContentList,
        currentStaticContent,
        totalPages,
        currentPage,
    };
}