// api/admin/course_payment/course_payment.api.ts
import { BaseApi } from '../../base.api.ts';
import type { CoursePayment } from '../../../types/CoursePayment';
import type {CreateCoursePaymentDto} from "../../../dto/course_payment.dto.ts";
export class CoursePaymentApi extends BaseApi<CreateCoursePaymentDto, CoursePayment> {
    protected resource = 'courses-payments';
}