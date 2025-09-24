// store/admin/role/role.store.ts
import { computed } from 'vue';
import { RoleApi } from '../../../api/admin/role/role.api';
import type { Role } from '../../../types/Role';
import type { CreateRoleDto } from '../../../dto/role.dto.ts';
import { BaseStore } from '../../BaseStore';

class RoleStore extends BaseStore<CreateRoleDto, Role> {
    public storeId = 'admin-role';
    public api = new RoleApi();
}

const roleStore = new RoleStore();

// базовый store без геттеров
export const useRoleStore = roleStore.getStore(roleStore.api);

// store с геттерами
export function useRoleStoreWithGetters() {
    const store = useRoleStore();

    const roleList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: true,
        }))
    );

    const currentRole = computed(() => store.item);

    return {
        ...store,
        roleList,
        currentRole,
    };
}