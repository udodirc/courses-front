// store/admin/menu/menu.store.ts
import { computed } from 'vue';
import { MenuApi } from '../../../api/admin/menu/menu.api';
import type { Menu } from '../../../types/Menu';
import type { CreateMenuDto } from '../../../dto/menu.dto.ts';
import { BaseStore } from '../../BaseStore';

class MenuStore extends BaseStore<CreateMenuDto, Menu> {
    public storeId = 'admin-menu';
    public api = new MenuApi();

    // методы изменения порядка
    async moveOrderUp(store: any, id: number) {
        await this.api.moveOrderUp(id);
        await store.fetchList();
    }

    async moveOrderDown(store: any, id: number) {
        await this.api.moveOrderDown(id);
        await store.fetchList();
    }
}

const menuStore = new MenuStore();

// базовый store без геттеров
export const useMenuStore = menuStore.getStore(menuStore.api);

// store с геттерами и пробросом методов
export function useMenuStoreWithGetters() {
    const store = useMenuStore();

    // вычисляемый список меню с дополнительными флагами
    const menuList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: true,
            canChangeOrder: true,
        }))
    );

    const currentMenu = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    // проброс методов изменения порядка через экземпляр MenuStore
    const moveOrderUp = (id: number) => menuStore.moveOrderUp(store, id);
    const moveOrderDown = (id: number) => menuStore.moveOrderDown(store, id);

    return {
        ...store,
        menuList,
        currentMenu,
        totalPages,
        currentPage,
        moveOrderUp,
        moveOrderDown,
    };
}