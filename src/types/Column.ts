export interface Column {
    label: string;
    field: string;
    format?: (value: any, item?: any) => string;
}