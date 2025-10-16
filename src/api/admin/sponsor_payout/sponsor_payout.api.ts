// api/admin/sponsor_payout/sponsor_payout.api.ts
import { BaseApi } from '../../base.api.ts';
import type { SponsorPayout } from '../../../types/SponsorPayout';
import type {CreateSponsorPayoutDto} from "../../../dto/sponsor_payout.dto.ts";
export class SponsorPayoutApi extends BaseApi<CreateSponsorPayoutDto, SponsorPayout> {
    protected resource = 'sponsor-payouts';
}