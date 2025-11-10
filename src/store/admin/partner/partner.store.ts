import { computed } from 'vue';
import { PartnerApi } from '../../../api/admin/partner/partner.api';
import type { Partner } from '../../../types/Partner';
import type { CreatePartnerDto } from '../../../dto/partner.dto.ts';
import { BaseStore } from '../../BaseStore';

class PartnerStore extends BaseStore<CreatePartnerDto, Partner> {
    public storeId = 'admin-partner';
    public api = new PartnerApi();

    // метод для получения информации о партнере по /info/:id
    async fetchInfo(id: number): Promise<Partner> {
        const res = await this.api.fetchInfo(id);
        return res.data;
    }
}

const partnerStore = new PartnerStore();

// обычный store Pinia
export const usePartnerStore = partnerStore.getStore(partnerStore.api);

// store с геттерами и проксированием fetchInfo
export function usePartnerStoreWithGetters() {
    const store = usePartnerStore();

    const partnerList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: true,
            canDelete: false,
            structure: true,
            canPay: true
        }))
    );

    const currentPartner = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    // проксируем fetchInfo в Pinia store
    const fetchInfo = async (id: number) => {
        store.loading = true;
        store.error = '';
        try {
            const partner = await partnerStore.fetchInfo(id);
            store.item = partner;
        } catch (e: any) {
            store.error = e?.response?.data?.message || 'Ошибка получения';
            throw e;
        } finally {
            store.loading = false;
        }
    };

    return {
        ...store,
        partnerList,
        currentPartner,
        totalPages,
        currentPage,
        fetchInfo,
    };
}