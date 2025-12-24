import { computed } from 'vue';
import { CourseSectionApi } from '../../../api/admin/course_section/course_section.api.ts';
import type { CourseSection } from '../../../types/CourseSection.ts';
import type { CreateCourseSectionDto } from '../../../dto/course-section.dto.ts';
import { BaseStore } from '../../BaseStore';

class CourseSectionStore extends BaseStore<CreateCourseSectionDto, CourseSection> {
    public storeId = 'admin-course_section';
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

    const currentCourseSection = computed(() => store.item);
    const currentCourseSectionName = computed(() => store.item?.name ?? '');
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        courseSectionList,
        currentCourseSection,
        currentCourseSectionName,
        totalPages,
        currentPage,
    };
}