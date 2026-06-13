import { computed } from 'vue';
import { BaseStore } from '../../BaseStore';
import type {TelegramSubscribe} from "../../../types/TelegramSubscribe.ts";
import { TelegramSubscribeApi } from "../../../api/admin/telegram_subscribe/telegram_subscribe.api.ts";

class TelegramSubscribeStore extends BaseStore<null, TelegramSubscribe> {
    public storeId = 'admin-telegram-subscribers';
    public api = new TelegramSubscribeApi();
}

const telegramSubscribeStore = new TelegramSubscribeStore();

export const useTelegramSubscribeStore= telegramSubscribeStore.getStore(telegramSubscribeStore.api);

export function useTelegramSubscribeStoreWithGetters() {
    const store = useTelegramSubscribeStore();

    const telegramSubscribeList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: false,
            canShowAction: false,
            canEditAction: false,
        }))
    );

    const currentTelegramSubscribe = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        telegramSubscribeList,
        currentTelegramSubscribe,
        totalPages,
        currentPage,
    };
}