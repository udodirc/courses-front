import { BaseApi } from '../../base.api.ts';
import type { Withdrawal } from "../../../types/Withdrawal.ts";
import type { CreateWithdrawalDto } from "../../../dto/withdrawal.dto.ts";

export class WithdrawalApi extends BaseApi<CreateWithdrawalDto, Withdrawal> {
    protected resource = 'withdrawals';
}