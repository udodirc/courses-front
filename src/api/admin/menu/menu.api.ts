// api/admin/menu/menu.api.ts
import { BaseApi } from '../../base.api.ts';
import type { Menu } from '../../../types/Menu';
import type { CreateMenuDto } from '../../../dto/menu.dto.ts';
import api from '../../index.ts';
export class MenuApi extends BaseApi<CreateMenuDto, Menu> {
    protected resource = 'menu';

    async moveOrderUp(id: number) {
        // используем api напрямую
        const res = await api.post(`/admin/${this.resource}/order/${id}/up`);
        return res.data;
    }

    async moveOrderDown(id: number) {
        const res = await api.post(`/admin/${this.resource}/order/${id}/down`);
        return res.data;
    }
}