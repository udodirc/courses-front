export interface  Menu {
    id: number;
    parent_id: number;
    name: string;
    status: boolean;
    createdAt: string; // или Date
}