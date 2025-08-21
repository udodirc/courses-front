// api/base.api.ts
import api from './index.ts';
import type { AxiosResponse, AxiosError } from 'axios';

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export abstract class BaseApi<TCreate, TEntity = any> {
    protected abstract resource: string;

    async getList(params?: Record<string, any>): Promise<ApiResponse<TEntity[]>> {
        const res: AxiosResponse<any> = await api.get(`/admin/${this.resource}`, { params });
        return res.data;
    }

    async fetch(id: number): Promise<ApiResponse<TEntity>> {
        try {
            const res: AxiosResponse<ApiResponse<TEntity>> = await api.get(`/admin/${this.resource}/${id}`);
            return res.data;
        } catch (err) {
            throw err as AxiosError;
        }
    }

    async create(data: TCreate): Promise<ApiResponse<TEntity>> {
        try {
            const res: AxiosResponse<ApiResponse<TEntity>> = await api.post(`/admin/${this.resource}`, data);
            return res.data;
        } catch (err) {
            console.log(
                err
            )
            throw err as AxiosError;
        }
    }

    async delete(id: number): Promise<ApiResponse<null>> {
        try {
            const res: AxiosResponse<ApiResponse<null>> = await api.delete(`/admin/${this.resource}/${id}`);
            return res.data;
        } catch (err) {
            throw err as AxiosError;
        }
    }
}