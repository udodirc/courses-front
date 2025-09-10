// store/admin/menu/menu.store.ts
import { MenuApi } from '../../../api/admin/menu/menu.api';
import type { Menu } from '../../../types/Menu';
import type { CreateMenuDto } from '../../../dto/menu.dto.ts';
import { BaseStore } from '../../BaseStore';

class MenuStore extends BaseStore<CreateMenuDto, Menu> {
    public storeId = 'admin-menu';
    public api = new MenuApi();
}

const menuStore = new MenuStore();

type MenuStoreState = {
    items: Menu[];
    item: Menu | null;
    loading: boolean;
    error: string;
};
export const useMenuStore = menuStore.getStore(menuStore.api, {
    getMenuList: (state: MenuStoreState): Menu[] =>
        Array.isArray(state.items)
            ? state.items.map(item => ({
                ...item,
                canToggleStatus: true,
                canChangeOrder: true,
            }))
            : [],
    currentMenu: (state: MenuStoreState): Menu | null => state.item,
});