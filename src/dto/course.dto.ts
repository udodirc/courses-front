export interface CreateCourseDto {
    partner_id: number;
    name: string;
    short_description: string;
    description: string;
    price: number;
    url: string;
    status: boolean;
    title: string;
    meta_description: string;
    meta_keywords: string;
    og_title: string;
    og_description: string;
    og_keywords: string;
    og_image: string;
    og_type: string;
    og_url: string;
    canonical_url: string;
    robots: string;
}