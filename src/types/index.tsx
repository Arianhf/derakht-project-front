export interface BlogPost {
    id: number;
    title: string;
    subtitle?: string;
    header_image?: {
        meta?: {
            download_url: string;
        };
        title?: string;
    };
    owner?: {
        first_name: string;
    };
    jalali_date?: string;
    reading_time?: number;
    tags?: string[];
    intro?: string;
    body?: string;
}

export interface HeroPost extends BlogPost {
    tags: string[];
}