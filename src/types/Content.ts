export interface  Content {
    id: number;
    menu_id: number;
    menu_name?: string;
    content: string;
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
    image_dir: string;
    image_og_dir: string;
    image_og_url: string;
    createdAt: string;
}