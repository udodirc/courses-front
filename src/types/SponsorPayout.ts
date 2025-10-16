export interface  SponsorPayout {
    id: number;
    course_id: number;
    partner_id: number;
    sponsor_id: number;
    amount: number;
    percentage: number;
    level: number;
    createdAt: string;
}