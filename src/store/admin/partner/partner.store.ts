import { computed } from 'vue';
import { PartnerApi } from '../../../api/admin/partner/partner.api';
import type { Partner } from '../../../types/Partner';
import type { CreatePartnerDto } from '../../../dto/partner.dto.ts';
import { BaseStore } from '../../BaseStore';

class PartnerStore extends BaseStore<CreatePartnerDto, Partner> {
    public storeId = 'admin-partner';
    public api = new PartnerApi();
}

const partnerStore = new PartnerStore();

// обычный store
export const usePartnerStore = partnerStore.getStore(partnerStore.api);

// store с геттерами
export function usePartnerStoreWithGetters() {
    const store = usePartnerStore();

    const partnerList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: true,
        }))
    );

    const currentPartner = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        partnerList,
        currentPartner,
        totalPages,
        currentPage,
    };
}