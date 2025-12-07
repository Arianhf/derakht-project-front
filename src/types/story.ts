// src/types/story.ts

// Story orientation type
export type StoryOrientation = 'LANDSCAPE' | 'PORTRAIT' | null;

// Story size type
export type StorySize = '20x20' | '25x25' | '15x23' | null;

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
    orientation: StoryOrientation;
    size: StorySize;
}

// Helper functions for story orientation and size

/**
 * Get CSS class based on story orientation
 * @param story - The story object
 * @returns CSS class name for orientation
 */
export const getOrientationClass = (story: Story | null | undefined): string => {
    if (!story) return 'story-default';
    if (story.orientation === 'LANDSCAPE') return 'story-landscape';
    if (story.orientation === 'PORTRAIT') return 'story-portrait';
    return 'story-default';
};

/**
 * Get size dimensions for a story
 * @param story - The story object
 * @returns Object with width and height dimensions
 */
export const getSizeDimensions = (story: Story | null | undefined): { width: number | 'auto'; height: number | 'auto' } => {
    if (!story || !story.size) {
        return { width: 'auto', height: 'auto' };
    }

    const sizes: Record<string, { width: number; height: number }> = {
        '20x20': { width: 20, height: 20 },
        '25x25': { width: 25, height: 25 },
        '15x23': { width: 15, height: 23 }
    };

    return sizes[story.size] || { width: 'auto', height: 'auto' };
};