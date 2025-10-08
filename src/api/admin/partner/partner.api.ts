// api/admin/user/user.api.ts
import { BaseApi } from '../../base.api.ts';
import type { Partner } from '../../../types/Partner';
import type { CreatePartnerDto } from '../../../dto/partner.dto.ts';

export class PartnerApi extends BaseApi<CreatePartnerDto, Partner> {
    protected resource = 'partners/structure';
}