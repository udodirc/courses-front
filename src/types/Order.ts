export interface  Order {
    id: number;
    course_id: number;
    course_name: string;
    partner_id: number;
    partner_name: string;
    order_number: string;
    amount: number;
    currency: string;
    status: string;
    payment_method: string;
    metadata: [];
    createdAt: string;
}