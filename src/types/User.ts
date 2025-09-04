export interface User {
    id: number;
    name: string;
    email: string;
    role?: {
        name: string;
    };
    status: boolean;
    createdAt: string; // или Date
}