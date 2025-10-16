// store/admin/course/course.store.ts
import { computed } from 'vue';
import { CoursePaymentApi } from '../../../api/admin/course_payment/course_payment.api';
import type {CoursePayment} from '../../../types/CoursePayment';
import type { CreateCoursePaymentDto } from '../../../dto/course_payment.dto.ts';
import { BaseStore } from '../../BaseStore';

class CoursePaymentStore extends BaseStore<CreateCoursePaymentDto, CoursePayment> {
    public storeId = 'admin-courses-payments';
    public api = new CoursePaymentApi();
}

const coursePaymentStore = new CoursePaymentStore();

export const useCoursePaymentStore = coursePaymentStore.getStore(coursePaymentStore.api);

export function useCoursePaymentStoreWithGetters() {
    const store = useCoursePaymentStore();

    const coursePaymentList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: false,
            canShowAction: false,
            canEditAction: false,
        }))
    );

    const currentCoursePayment = computed(() => store.item);
    const totalPages = computed(() => store.totalPages);
    const currentPage = computed(() => store.currentPage);

    return {
        ...store,
        coursePaymentList,
        currentCoursePayment,
        totalPages,
        currentPage,
    };
}