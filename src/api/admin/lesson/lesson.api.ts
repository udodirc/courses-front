import { BaseApi } from '../../base.api.ts';
import type { Lesson } from '../../../types/Lesson.ts';
import type { CreateLessonDto } from "../../../dto/lesson.dto.ts";

export class LessonApi extends BaseApi<CreateLessonDto, Lesson> {
    protected resource = 'lessons';
}