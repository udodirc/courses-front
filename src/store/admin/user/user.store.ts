// store/admin/user/user.store.ts
import { UserApi } from '../../../api/admin/user/user.api';
import type { User } from '../../../types/User';
import type { CreateUserDto } from '../../../dto/user.dto.ts';
import { BaseStore } from '../../BaseStore';

class UserStore extends BaseStore<CreateUserDto, User> {
    public storeId = 'admin-user';
    public api = new UserApi();
}

const userStore = new UserStore();

type UserStoreState = {
    items: User[];
    item: User | null;
    loading: boolean;
    error: string;
};
export const useUserStore = userStore.getStore(userStore.api, {
    getUserList: (state: UserStoreState): User[] => state.items,
    currentUser: (state: UserStoreState): User | null => state.item,
});