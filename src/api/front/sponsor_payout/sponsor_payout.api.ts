import { BaseApi } from '../../base.api.ts';
import type { SponsorPayout } from '../../../types/SponsorPayout';
import type { CreateSponsorPayoutDto } from "../../../dto/sponsor_payout.dto.ts";
export class FrontSponsorPayoutApi extends BaseApi<CreateSponsorPayoutDto, SponsorPayout> {
    protected resource = 'sponsor-payouts';
    protected urlPrefix = '/partner';
}