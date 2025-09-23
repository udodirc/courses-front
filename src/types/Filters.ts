export type Option = {
    label: string;
    value: string | number | null;
};

export type FilterSchemaItem = {
    field: string;
    label: string;
    type: 'text' | 'email' | 'select' | 'date';
    col?: 'left' | 'middle';
    options?: Option[];
};