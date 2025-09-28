import { computed } from 'vue';
import { ContentApi } from '../../../api/admin/content/content.api';
import type { Content } from '../../../types/Content';
import type { CreateContentDto } from '../../../dto/content.dto.ts';
import { BaseStore } from '../../BaseStore';

class ContentStore extends BaseStore<CreateContentDto, Content> {
    public storeId = 'admin-content';
    public api = new ContentApi();
}

const contentStore = new ContentStore();

export const useContentStore = contentStore.getStore(contentStore.api);

export function useContentStoreWithGetters() {
    const store = useContentStore();

    const contentList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: true
        }))
    );

    const currentContent = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        contentList,
        currentContent,
        totalPages,
        currentPage,
    };
}