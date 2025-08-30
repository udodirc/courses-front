import { ContentApi } from '../../../api/admin/content/content.api';
import type { Content } from '../../../types/Content';
import type { CreateContentDto } from '../../../dto/content.dto.ts';
import { BaseStore } from '../../BaseStore';

class ContentStore extends BaseStore<CreateContentDto, Content> {
    public storeId = 'admin-content';
    public api = new ContentApi();
}

const contentStore = new ContentStore();

type ContentStoreState = {
    items: Content[];
    item: Content | null;
    loading: boolean;
    error: string;
};
export const useContentStore = contentStore.getStore(contentStore.api, {
    getContentList: (state: ContentStoreState): Content[] => Array.isArray(state.items) ? state.items : [],
    currentContent: (state: ContentStoreState): Content | null => state.item,
});