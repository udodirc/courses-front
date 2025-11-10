// src/api/admin/partner/structure.api.ts
import { BaseApi } from '../../base.api.ts';
import type { Partner } from '../../../types/Partner';
import type { CreatePartnerDto } from '../../../dto/partner.dto.ts';

export class StructureApi extends BaseApi<CreatePartnerDto, Partner> {
    protected resource = '';

    constructor(partnerId: number) {
        super();
        this.resource = `partners/structure/${partnerId}`;
    }
}