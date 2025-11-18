import { computed } from 'vue';
import { BaseStore } from '../../BaseStore';
import type { CreateWithdrawalDto } from "../../../dto/withdrawal.dto.ts";
import type { Withdrawal } from "../../../types/Withdrawal.ts";
import { WithdrawalApi } from "../../../api/admin/withdrawal/withdrawal.api.ts";
import { useEntitySave } from '../../../composables/useEntitySave';

class WithdrawalStore extends BaseStore<CreateWithdrawalDto, Withdrawal> {
    public storeId = 'admin-withdrawal';
    public api = new WithdrawalApi();
}

const withdrawalStore = new WithdrawalStore();

export const useWithdrawalStore = withdrawalStore.getStore(withdrawalStore.api);

export function useWithdrawalStoreWithGetters() {
    const store = useWithdrawalStore();
    const { saveEntity } = useEntitySave();
    const withdrawalList = computed(() =>
        store.items.map(item => ({
            ...item,
        }))
    );

    async function changeStatus(id: number, status: string) {
        await saveEntity(
            '/admin/withdrawals/change-status',
            { id, status },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    const currentWithdrawal = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        withdrawalList,
        currentWithdrawal,
        totalPages,
        currentPage,
        changeStatus
    };
}