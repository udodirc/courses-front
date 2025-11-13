export interface  Lesson {
    id: number;
    course_section_id: number;
    name: string;
    content: string;
    duration: number;
    status: boolean;
    free_pay: boolean;
    video: string;
    video_dir: string;
    video_url: string;
    video_all_dir: string;
    createdAt: string;
}