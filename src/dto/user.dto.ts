// src/dtos/user.dto.ts

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: string;
}