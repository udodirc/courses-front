import { computed } from 'vue';
import { OrderApi } from '../../../api/admin/order/order.api.ts';
import type { Order } from '../../../types/Order.ts';
import type { CreateOrderDto } from '../../../dto/order.dto.ts';
import { BaseStore } from '../../BaseStore';

class OrderStore extends BaseStore<CreateOrderDto, Order> {
    public storeId = 'admin-order';
    public api = new OrderApi();
}

const orderStore = new OrderStore();

export const useOrderStore = orderStore.getStore(orderStore.api);

export function useOrderStoreWithGetters() {
    const store = useOrderStore();
    const orderList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: false,   // если тебе не нужно — оставь false
            canShowActions: true,     // <--- включаем показывать колонку действий
            canEditAction: false,
        }))
    );

    const currentOrder = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        orderList,
        currentOrder,
        totalPages,
        currentPage,
    };
}