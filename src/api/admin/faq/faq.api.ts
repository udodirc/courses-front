import { BaseApi } from '../../base.api.ts';
import { CreateFaqDto } from "../../../dto/faq.dto.ts";
import type { Faq } from "../../../types/Faq.ts";

export class FaqApi extends BaseApi<CreateFaqDto, Faq> {
    protected resource = 'faq';
}