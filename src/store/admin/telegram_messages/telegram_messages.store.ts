import { computed } from 'vue';
import { TelegramMessagesApi } from '../../../api/admin/telegram_messages/telegram_messages.api.ts';
import type { TelegramMessages } from '../../../types/TelegramMessages.ts';
import type { CreateTelegramMessagesDto } from '../../../dto/telegram_messages.dto.ts';
import { BaseStore } from '../../BaseStore';

class TelegramMessagesStore extends BaseStore<CreateTelegramMessagesDto, TelegramMessages> {
    public storeId = 'admin-telegram-messages';
    public api = new TelegramMessagesApi();
}

const telegramMessagesStore = new TelegramMessagesStore();

export const useTelegramMessagesStore = telegramMessagesStore.getStore(telegramMessagesStore.api);

export function useTelegramMessagesStoreWithGetters() {
    const store = useTelegramMessagesStore();

    const telegramMessagesList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: false,
        }))
    );

    const currentMenu = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        telegramMessagesList,
        currentMenu,
        totalPages,
        currentPage
    };
}