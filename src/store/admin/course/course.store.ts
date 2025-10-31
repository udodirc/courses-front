import { computed } from 'vue';
import { CourseApi } from '../../../api/admin/course/course.api.ts';
import type { Course } from '../../../types/Course.ts';
import type { CreateCourseDto } from '../../../dto/course.dto.ts';
import { BaseStore } from '../../BaseStore';

class CourseStore extends BaseStore<CreateCourseDto, Course> {
    public storeId = 'admin-course';
    public api = new CourseApi();
}

const courseStore = new CourseStore();

export const useCourseStore = courseStore.getStore(courseStore.api);

export function useCourseStoreWithGetters() {
    const store = useCourseStore();
    const courseList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: true,
        }))
    );

    const currentProject = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        courseList,
        currentProject,
        totalPages,
        currentPage,
    };
}