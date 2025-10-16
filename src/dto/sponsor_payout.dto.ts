export interface CreateSponsorPayoutDto {
    course_id: number;
    partner_id: number;
    sponsor_id: number;
    amount: number;
    percentage: number;
    level: number;
}