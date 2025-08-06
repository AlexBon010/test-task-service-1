export interface RecordFilter {
    field: string;
    value: string | number | boolean;
    operator?: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'ne' | 'in' | 'regex';
}