export interface CreateOrderDto {
    course_id: number;
    partner_id: number;
    order_number: string;
    amount: number;
    currency: string;
    status: string;
    payment_method: string;
    metadata: [];
}