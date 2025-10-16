// store/admin/sponsor_payout/sponsor_payout.store.ts
import { computed } from 'vue';
import { SponsorPayoutApi } from '../../../api/admin/sponsor_payout/sponsor_payout.api';
import type { SponsorPayout } from '../../../types/SponsorPayout';
import type { CreateSponsorPayoutDto } from '../../../dto/sponsor_payout.dto.ts';
import { BaseStore } from '../../BaseStore';

class SponsorPayoutStore extends BaseStore<CreateSponsorPayoutDto, SponsorPayout> {
    public storeId = 'admin-menu';
    public api = new SponsorPayoutApi();
}

const sponsorPayoutStore = new SponsorPayoutStore();

export const useCoursePaymentStore = sponsorPayoutStore.getStore(sponsorPayoutStore.api);

export function useSponsorPayoutStoreWithGetters() {
    const store = useCoursePaymentStore();

    const sponsorPayoutList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: false,
            canShowAction: false,
            canEditAction: false,
        }))
    );

    const currentCoursePayment = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        sponsorPayoutList,
        currentCoursePayment,
        totalPages,
        currentPage,
    };
}