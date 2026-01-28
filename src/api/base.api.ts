// api/base.api.ts
import api from './index.ts';
import type { AxiosResponse, AxiosError } from 'axios';

export interface PaginationMeta {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    meta?: PaginationMeta;
}

export abstract class BaseApi<TCreate, TEntity = any> {
    protected abstract resource: string;

    // По умолчанию админская зона
    protected urlPrefix = '/admin';

    async getList(params?: Record<string, any>, url?: string): Promise<ApiResponse<TEntity[]>> {
        const requestUrl = url || `${this.urlPrefix}/${this.resource}`;

        const res: AxiosResponse<ApiResponse<TEntity[]>> = await api.get(requestUrl, { params });
        return res.data;
    }

    async fetch(id: number): Promise<ApiResponse<TEntity>> {
        try {
            const res: AxiosResponse<ApiResponse<TEntity>> = await api.get(`${this.urlPrefix}/${this.resource}/${id}`);
            return res.data;
        } catch (err) {
            throw err as AxiosError;
        }
    }

    async create(
        ...args: TCreate extends null ? [data?: null] : [data: TCreate]
    ): Promise<ApiResponse<TEntity>> {
        const data = args[0];
        try {
            const res: AxiosResponse<ApiResponse<TEntity>> = await api.post(
                `${this.urlPrefix}/${this.resource}`,
                data
            );
            return res.data;
        } catch (err) {
            console.error(err);
            throw err as AxiosError;
        }
    }

    async delete(id: number): Promise<ApiResponse<null>> {
        try {
            const res: AxiosResponse<ApiResponse<null>> = await api.delete(`${this.urlPrefix}/${this.resource}/${id}`);
            return res.data;
        } catch (err) {
            throw err as AxiosError;
        }
    }
}