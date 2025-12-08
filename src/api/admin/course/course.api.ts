import { BaseApi } from '../../base.api.ts';
import type { Course } from '../../../types/Course.ts';
import type { CreateCourseDto } from '../../../dto/course.dto.ts';
import api from "../../index.ts";

export class CourseApi extends BaseApi<CreateCourseDto, Course> {
    protected resource = 'course';

    async toggleStatus(id: number) {
        // используем api напрямую
        const res = await api.post(`/admin/${this.resource}/status/${id}`);
        return res.data;
    }
}