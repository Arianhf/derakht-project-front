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
}

export interface Story {
    activity_type: 'WRITE_FOR_DRAWING' | string;
    author: number;
    created_at: string;
    id: string;
    parts: StoryPart[];
    story_template: string;
    title: string;
    cover_image: string | null;
    background_image: string | null;
}