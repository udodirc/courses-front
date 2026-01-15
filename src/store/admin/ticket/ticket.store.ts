import { computed } from 'vue';
import { TicketApi } from '../../../api/admin/ticket/ticket.api.ts';
import type { Ticket } from '../../../types/Ticket';
import type { CreateTicketDto } from '../../../dto/ticket.dto.ts';
import { BaseStore } from '../../BaseStore';

class TicketStore extends BaseStore<CreateTicketDto, Ticket> {
    public storeId = 'admin-ticket';
    public api = new TicketApi();
}

const ticketStore = new TicketStore();

export const useTicketStore = ticketStore.getStore(ticketStore.api);

export function useTicketWithGetters() {
    const store = useTicketStore();

    const ticketList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: true,
        }))
    );

    const currentTicket = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        ticketList,
        currentTicket,
        totalPages,
        currentPage,
    };
}