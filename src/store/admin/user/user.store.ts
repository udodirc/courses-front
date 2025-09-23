import { computed } from 'vue';
import { UserApi } from '../../../api/admin/user/user.api';
import type { User } from '../../../types/User';
import type { CreateUserDto } from '../../../dto/user.dto.ts';
import { BaseStore } from '../../BaseStore';

class UserStore extends BaseStore<CreateUserDto, User> {
    public storeId = 'admin-user';
    public api = new UserApi();
}

const userStore = new UserStore();

// обычный store
export const useUserStore = userStore.getStore(userStore.api);

// store с геттерами
export function useUserStoreWithGetters() {
    const store = useUserStore();

    const userList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: true,
        }))
    );

    const currentUser = computed(() => store.item);

    return {
        ...store,
        userList,
        currentUser,
    };
}