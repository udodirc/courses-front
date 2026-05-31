import { BaseApi } from '../../base.api.ts';
import type { Partner } from '../../../types/Partner';
import type { CreatePartnerDto } from '../../../dto/partner.dto.ts';
import api from "../../index.ts";

export class FrontPartnerApi extends BaseApi<CreatePartnerDto, Partner> {
    protected resource = 'partners';
    protected urlPrefix = '/partner';

    async stats(): Promise<{ data: Partner }> {
        const res = await api.get(`partner/stats`);
        return res.data;
    }
}