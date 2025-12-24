import { BaseApi } from '../../base.api.ts';
import type { StaticContent } from '../../../types/StaticContent.ts';
import type { CreateStaticContentDto } from '../../../dto/static_content.dto.ts';

export class StaticContentApi extends BaseApi<CreateStaticContentDto, StaticContent> {
    protected resource = 'static-content';
}