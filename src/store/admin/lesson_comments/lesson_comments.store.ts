import { computed } from 'vue';
import { BaseStore } from '../../BaseStore';
import type { CreateLessonCommentsDto } from "../../../dto/lesson_coments.dto.ts";
import type { LessonComments } from "../../../types/LessonComments.ts";
import { LessonCommentsApi } from "../../../api/admin/lesson-comments/lesson_comments.api.ts";

class LessonCommentsStore extends BaseStore<CreateLessonCommentsDto, LessonComments> {
    public storeId = 'admin-lesson-comments';
    public api = new LessonCommentsApi();
}

const lessonCommentsStore = new LessonCommentsStore();

export const useLessonCommentsStore = lessonCommentsStore.getStore(lessonCommentsStore.api);

export function useLessonCommentsStoreWithGetters() {
    const store = useLessonCommentsStore();
    const lessonCommentsList = computed(() =>
        store.items.map(item => ({
            ...item,
        }))
    );

    const currentLessonComments = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        lessonCommentsList,
        currentLessonComments,
        totalPages,
        currentPage,
    };
}