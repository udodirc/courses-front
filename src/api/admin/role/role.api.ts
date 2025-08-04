import { BaseApi } from '../../base.api.ts';
import type { Role } from '../../../types/Role';
import type { CreateRoleDto } from '../../../dto/role.dto.ts';

export class RoleApi extends BaseApi<CreateRoleDto, Role> {
    protected resource = 'roles';
}