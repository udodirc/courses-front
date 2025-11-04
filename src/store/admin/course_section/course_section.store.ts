import { computed } from 'vue';
import { CourseSectionApi } from '../../../api/admin/course_section/course_section.api.ts';
import type { CourseSection } from '../../../types/CourseSection.ts';
import type { CreateCourseSectionDto } from '../../../dto/course-section.dto.ts';
import { BaseStore } from '../../BaseStore';

class CourseSectionStore extends BaseStore<CreateCourseSectionDto, CourseSection> {
    public storeId = 'admin-course-section';
    public api = new CourseSectionApi();
}

const courseSectionStore = new CourseSectionStore();

export const useCourseSectionStore = courseSectionStore.getStore(courseSectionStore.api);

export function useCourseSectionStoreWithGetters() {
    const store = useCourseSectionStore();
    const courseSectionList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: true,
        }))
    );

    const currentSectionCourse = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        courseSectionList,
        currentSectionCourse,
        totalPages,
        currentPage,
    };
}