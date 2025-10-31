import { BaseApi } from '../../base.api.ts';
import type { Course } from '../../../types/Course.ts';
import type { CreateCourseDto } from '../../../dto/course.dto.ts';

export class CourseApi extends BaseApi<CreateCourseDto, Course> {
    protected resource = 'course';
}