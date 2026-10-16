export interface PayloadPaged {
    skip: number;
    take: number;
    SortBy?: string | string[] | null  ;
    SortDirection?: string | number;
    includeInactive?: boolean;
}