import { BaseApi } from '../../base.api.ts';
import type { Project } from '../../../types/Project';
import type { CreateProjectDto } from '../../../dto/project.dto.ts';

export class ProjectApi extends BaseApi<CreateProjectDto, Project> {
    protected resource = 'project';
}