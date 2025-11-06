import { computed } from 'vue';
import { LessonApi } from '../../../api/admin/lesson/lesson.api.ts';
import type { Lesson } from '../../../types/Lesson.ts';
import type { CreateLessonDto } from '../../../dto/lesson.dto.ts';
import { BaseStore } from '../../BaseStore';

class LessonStore extends BaseStore<CreateLessonDto, Lesson> {
    public storeId = 'admin-lessons';
    public api = new LessonApi();
}

const lessonStore = new LessonStore();

export const useLessonStore = lessonStore.getStore(lessonStore.api);

export function useLessonStoreWithGetters() {
    const store = useLessonStore();
    const lessonList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: true,
        }))
    );

    const currentLesson = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        lessonList,
        currentLesson,
        totalPages,
        currentPage,
    };
}