import { StaticContentApi } from '../../../api/admin/static_content/static_content.api';
import type { StaticContent } from '../../../types/StaticContent.ts';
import type { CreateStaticContentDto } from '../../../dto/static_content.dto.ts';
import { BaseStore } from '../../BaseStore';

class StaticContentStore extends BaseStore<CreateStaticContentDto, StaticContent> {
    public storeId = 'admin-static-content';
    public api = new StaticContentApi();
}

const staticContentStore = new StaticContentStore();

type StaticContentStoreState = {
    items: StaticContent[];
    item: StaticContent | null;
    loading: boolean;
    error: string;
};
export const useStaticContentStore = staticContentStore.getStore(staticContentStore.api, {
    getStaticContentList: (state: StaticContentStoreState): StaticContent[] =>
        Array.isArray(state.items)
            ? state.items.map(item => ({
                ...item,
                canToggleStatus: true
            }))
            : [],
    currentStaticContent: (state: StaticContentStoreState): StaticContent | null => state.item,
});