// BaseState<T>
export type BaseState<TEntity> = {
    items: TEntity[];
    item: TEntity | null;
    loading: boolean;
    error: string;
    filters: Record<string, any>;
    currentPage: number;
    totalPages: number;
    perPage: number;
};