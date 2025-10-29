import { BaseApi } from '../../base.api.ts';
import type { Partner } from '../../../types/Partner';
import type { CreatePartnerDto } from '../../../dto/partner.dto.ts';

export class FrontPartnerApi extends BaseApi<CreatePartnerDto, Partner> {
    protected resource = 'partners';
    protected urlPrefix = '/partner';
}