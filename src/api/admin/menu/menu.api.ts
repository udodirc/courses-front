import { BaseApi } from '../../base.api.ts';
import type { Menu } from '../../../types/Menu';
import type { CreateMenuDto } from '../../../dto/menu.dto.ts';

export class MenuApi extends BaseApi<CreateMenuDto, Menu> {
    protected resource = 'menu';
}