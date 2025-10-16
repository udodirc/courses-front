export interface  CoursePayment {
    id: number;
    course_id: number;
    partner_id: number;
    amount: number;
    status: boolean;
    createdAt: string; // или Date
}