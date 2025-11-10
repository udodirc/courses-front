// src/store/admin/partner/structure.store.ts

import { computed, ref, type Ref } from 'vue';
import type { Partner } from '../../../types/Partner';
import type { CreatePartnerDto } from '../../../dto/partner.dto';
import { BaseStore } from '../../BaseStore';
import { StructureApi } from '../../../api/admin/partner/structure.api';

class StructureStore extends BaseStore<CreatePartnerDto, Partner> {
    public storeId = 'admin-partner-structure';

    // partnerIdRef будет содержать текущий ID партнера
    private partnerIdRef: Ref<number>;

    // API теперь является геттером и всегда использует актуальный ID
    public get api(): StructureApi {
        return new StructureApi(this.partnerIdRef.value);
    }

    constructor(initialPartnerId: number) {
        super();
        this.partnerIdRef = ref(initialPartnerId);
    }

    // ✅ Добавляем метод для обновления ID
    public updatePartnerId(newId: number) {
        this.partnerIdRef.value = newId;
        // Опционально: сбросить страницу при смене ID партнера
        // Если BaseStore имеет reactive currentPage:
        // this.currentPage.value = 1;
    }

    public getPartnerId() {
        return this.partnerIdRef.value;
    }
}


export function useStructureStore(partnerId: number) {
    const structureStoreInstance = new StructureStore(partnerId);

    // getStore() должен быть вызван с экземпляром StructureStore, чтобы
    // он мог получить актуальный API через геттер.
    const store = structureStoreInstance.getStore(structureStoreInstance.api)();

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
        // ✅ Привязываем метод обновления ID к возвращаемому объекту
        updatePartnerId: structureStoreInstance.updatePartnerId.bind(structureStoreInstance),
        structureList,
        currentPartner,
        totalPages,
        currentPage,
    };
}