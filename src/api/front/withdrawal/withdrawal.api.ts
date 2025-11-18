import { BaseApi } from '../../base.api.ts';
import type { Withdrawal } from '../../../types/Withdrawal';
import type { CreateWithdrawalDto } from '../../../dto/withdrawal.dto.ts';
export class FrontWithdrawalApi extends BaseApi<CreateWithdrawalDto, Withdrawal> {
    protected resource = 'withdrawals';
    protected urlPrefix = '/partner';
}