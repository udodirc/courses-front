import { UserApi } from '../../../api/admin/user/user.api';
import type { User } from '../../../types/User';
import type { CreateUserDto } from '../../../dto/user.dto.ts';
import { BaseStore } from '../../BaseStore';
import type { BaseState } from '../../../types/BaseState.ts'; // <-- подключаем общий тип
import { PAGINATION } from '../../../config/pagination.js';
class UserStore extends BaseStore<CreateUserDto, User> {
    public storeId = 'admin-user';
    public api = new UserApi();
}

const userStore = new UserStore();

export const useUserStore = userStore.getStore(
    userStore.api, {
        getUserList: (state: BaseState<User>): User[] => state.items,
        currentUser: (state: BaseState<User>): User | null => state.item,
    },
    { perPage: PAGINATION.userPerPage }
);
