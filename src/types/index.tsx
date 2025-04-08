// src/types/index.tsx
export interface BlogPost {
    id: number;
    title: string;
    subtitle?: string;
    intro?: string;
    header_image?: {
        meta?: {
            download_url: string;
        };
        title?: string;
    };
    owner?: {
        first_name: string;
        last_name?: string;
        age?: number;
        profile_image?: string | null;
    };
    jalali_date?: string;
    reading_time?: number;
    tags?: string[];
    body?: string;
    featured?: boolean;
    hero?: boolean;
    alternative_titles?: string[];
}

export interface HeroPost extends BlogPost {
    tags: string[];
}