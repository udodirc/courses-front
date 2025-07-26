// api/admin/user/user.api.ts
import { BaseApi } from '../../base.api.ts';
import type { User } from '../../../types/User';
import type { CreateUserDto } from '../../../dto/user.dto.ts';

export class UserApi extends BaseApi<CreateUserDto, User> {
    protected resource = 'users';
}