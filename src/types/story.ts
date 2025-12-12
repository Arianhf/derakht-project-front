// src/types/story.ts
export interface StoryResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface StoryTemplate {
    id: string;  // UUID
    title: string;
    description: string;
    activity_type: 'WRITE_FOR_DRAWING' | string;
    template_parts: TemplatePart[];
    cover_image: string | null;
}

export interface TemplatePart {
    id: string;  // UUID
    position: number;
    prompt_text: string;
    illustration: string | null;
}

export interface StoryPart {
    created_at: string;
    id: string;
    position: number;
    text: string;
    story_part_template: string;
    illustration: string | null;
    canvas_data?: string | null;  // Fabric.js canvas JSON for advanced text editing
}

export interface Author {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    age: number;
    profile_image: string | null;
    bio: string;
    profile_url: string;
    email: string;
    social_links?: {
        [key: string]: string;
    };
}

// Asset types for reusable images
export interface Asset {
  id: string;
  url: string;
  name: string;
  size: number;
  mime_type: string;
  created_at: string;
}

export interface AssetsResponse {
  assets: Asset[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

// Story display configuration types
export type StoryOrientation = 'LANDSCAPE' | 'PORTRAIT' | null;
export type StorySize = '20x20' | '25x25' | '15x23' | null;

export interface Story {
    activity_type: 'WRITE_FOR_DRAWING' | string;
    author: number | Author;
    created_at: string;
    id: string;
    parts: StoryPart[];
    story_template: string;
    title: string;
    cover_image: string | null;
    background_color: string | null;
    font_color: string | null;
    status?: 'DRAFT' | 'COMPLETED';
    orientation?: StoryOrientation;
    size?: StorySize;
}