export interface  Menu {
    id: number;
    parent_id: number;
    name: string;
    url: string;
    status: boolean;
    createdAt: string; // или Date
}