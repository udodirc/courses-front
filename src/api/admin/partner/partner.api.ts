import { BaseApi } from '../../base.api.ts';
import type { Partner } from '../../../types/Partner';
import type { CreatePartnerDto } from '../../../dto/partner.dto.ts';
import api from "../../index.ts";

export class PartnerApi extends BaseApi<CreatePartnerDto, Partner> {
    protected resource = 'partners';

    async fetchInfo(id: number): Promise<{ data: Partner }> {
        const res = await api.get(`/admin/${this.resource}/info/${id}`);
        return res.data;
    }
}