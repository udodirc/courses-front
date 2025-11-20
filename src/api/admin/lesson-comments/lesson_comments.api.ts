import { BaseApi } from '../../base.api.ts';
import type { LessonComments } from "../../../types/LessonComments.ts";
import type { CreateLessonCommentsDto } from "../../../dto/lesson_coments.dto.ts";

export class LessonCommentsApi extends BaseApi<CreateLessonCommentsDto, LessonComments> {
    protected resource = 'lesson-coments';
}