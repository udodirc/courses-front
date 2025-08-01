export interface User {
    id: number;
    name: string;
    email: string;
    role?: {
        name: string;
    };
    createdAt: string; // или Date
}