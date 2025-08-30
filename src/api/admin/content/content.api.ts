import { BaseApi } from '../../base.api.ts';
import type { Content } from '../../../types/Content';
import type { CreateContentDto } from '../../../dto/content.dto.ts';

export class ContentApi extends BaseApi<CreateContentDto, Content> {
    protected resource = 'content';
}