export interface  Lesson {
    id: number;
    course_section_id: number;
    name: string;
    content: string;
    duration: number;
    status: boolean;
    free_pay: boolean;
    createdAt: string;
}