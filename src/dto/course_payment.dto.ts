export interface CreateCoursePaymentDto {
    course_id: number;
    partner_id: number;
    amount: number;
    status: boolean;
}