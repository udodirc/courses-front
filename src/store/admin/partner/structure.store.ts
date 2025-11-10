// src/store/admin/partner/structure.store.ts
import { computed } from 'vue';
import type { Partner } from '../../../types/Partner';
import type { CreatePartnerDto } from '../../../dto/partner.dto';
import { BaseStore } from '../../BaseStore';
import { StructureApi } from '../../../api/admin/partner/structure.api';

class StructureStore extends BaseStore<CreatePartnerDto, Partner> {
    public storeId = 'admin-partner-structure';
    public api: StructureApi;

    constructor(partnerId: number) {
        super();
        this.api = new StructureApi(partnerId);
    }
}


export function useStructureStore(partnerId: number) {
    const structureStore = new StructureStore(partnerId);
    const store = structureStore.getStore(structureStore.api)();

    const structureList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: true,
            canDelete: false,
            structure: true,
            canPay: true,
        }))
    );

    const currentPartner = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        structureList,
        currentPartner,
        totalPages,
        currentPage,
    };
}