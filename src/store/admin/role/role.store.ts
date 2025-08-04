import { RoleApi } from '../../../api/admin/role/role.api';
import type { Role } from '../../../types/Role';
import type { CreateRoleDto } from '../../../dto/role.dto.ts';
import { BaseStore } from '../../BaseStore';

class RoleStore extends BaseStore<CreateRoleDto, Role> {
    public storeId = 'admin-role';
    public api = new RoleApi();
}

const roleStore = new RoleStore();

type RoleStoreState = {
    items: Role[];
    item: Role | null;
    loading: boolean;
    error: string;
};
export const useRoleStore = roleStore.getStore(roleStore.api, {
    getRoleList: (state: RoleStoreState): Role[] => state.items,
    currentRole: (state: RoleStoreState): Role | null => state.item,
});