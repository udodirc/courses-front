import { computed } from 'vue';
import { BaseStore } from '../../BaseStore';
import type { CreateFaqDto } from "../../../dto/faq.dto.ts";
import type { Faq } from "../../../types/Faq.ts";
import { FaqApi } from "../../../api/admin/faq/faq.api.ts";

class FaqStore extends BaseStore<CreateFaqDto, Faq> {
    public storeId = 'admin-faq';
    public api = new FaqApi();
}

const faqStore = new FaqStore();

export const useFaqStore = faqStore.getStore(faqStore.api);

export function useFaqStoreWithGetters() {
    const store = useFaqStore();

    const faqList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: true,
        }))
    );

    const currentFaq = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        faqList,
        currentFaq,
        totalPages,
        currentPage,
    };
}