export type ContentType<T extends keyof ContentTypes, P extends boolean = true> = ContentTypes<P>[T];

export interface APIResponseMany<T extends keyof ContentTypes> {
    data: ContentType<T>[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface APIResponseSingle<T extends keyof ContentTypes> {
    data: ContentType<T>;
}

export interface APIRequestParams<T extends keyof ContentTypes> {
    populate?: any;
    fields?: (keyof ContentType<T, false>)[];
    locale?: string | string[];
    filters?: any; sort?: `${string & keyof ContentType<T, false>}:asc` | `${string & keyof ContentType<T, false>}:desc` | (`${string & keyof ContentType<T, false>}:asc` | `${string & keyof ContentType<T, false>}:desc`)[]; pagination?: {
        page?: number;
        pageSize?: number;
    };
}
