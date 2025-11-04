import { BaseApi } from '../../base.api.ts';
import type { CourseSection } from '../../../types/CourseSection.ts';
import type { CreateCourseSectionDto } from "../../../dto/course-section.dto.ts";

export class CourseSectionApi extends BaseApi<CreateCourseSectionDto, CourseSection> {
    protected resource = 'course-section';
}