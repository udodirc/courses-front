// api/admin/user/user.api.ts
import { BaseApi } from '../../base.api.ts';
import type { ApiResponse } from '../../base.api.ts';
import type { User } from '../../../types/User';
import type { CreateUserDto } from '../../../dto/user.dto.ts';
import type { ProfileDto } from '../../../dto/profile.dto.ts';
import api from '../../../api/index.ts';

export class UserApi extends BaseApi<CreateUserDto, User> {
    protected resource = 'users';

    async profileUser(): Promise<ApiResponse<User>> {
        const res = await api.get(`/admin/${this.resource}/profile`);
        return res.data;
    }

    async updateProfile(data: ProfileDto): Promise<ApiResponse<User>> {
        const res = await api.put(`/admin/${this.resource}/profile`, data);
        return res.data;
    }
}