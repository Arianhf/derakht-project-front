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
    activity_type: 'WRITE_FOR_DRAWING' | 'ILLUSTRATE' | 'COMPLETE_STORY';
    orientation: 'PORTRAIT' | 'LANDSCAPE';
    size: '20x20' | '25x25' | '15x23';
    template_parts: TemplatePart[];
    cover_image: string | null;
}

export interface TemplatePart {
    id: string;  // UUID
    position: number;
    canvas_text_template: object | null;  // Canvas JSON for text canvas template
    canvas_illustration_template: object | null;  // Canvas JSON for illustration canvas template
}

export interface StoryPart {
    created_at: string;
    id: string;
    position: number;
    story_part_template: string;
    canvas_text_data: object | null;  // Canvas JSON for text canvas
    canvas_illustration_data: object | null;  // Canvas JSON for illustration canvas
}

// Canvas metadata structure for storing canvas data with dimensions
export interface CanvasMetadata {
    version: string;              // Version for future compatibility (e.g., "1.0")
    layoutType: 'square' | 'landscapeRectangle' | 'portraitRectangle' | 'default';
    originalWidth: number;        // Standard width used during creation
    originalHeight: number;       // Standard height used during creation
    canvasJSON: object;           // Fabric.js JSON data
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

// Admin Template Management Types
export interface CreateTemplatePartPayload {
    position: number;
    canvas_text_template?: object | null;
    canvas_illustration_template?: object | null;
}

export interface CreateTemplatePayload {
    title: string;
    description: string;
    activity_type: 'WRITE_FOR_DRAWING' | 'ILLUSTRATE' | 'COMPLETE_STORY';
    orientation: 'PORTRAIT' | 'LANDSCAPE';
    size: '20x20' | '25x25' | '15x23';
    cover_image?: File | null;
    template_parts?: CreateTemplatePartPayload[];
}

export interface UpdateTemplatePayload {
    title?: string;
    description?: string;
    activity_type?: 'WRITE_FOR_DRAWING' | 'ILLUSTRATE' | 'COMPLETE_STORY';
    orientation?: 'PORTRAIT' | 'LANDSCAPE';
    size?: '20x20' | '25x25' | '15x23';
    cover_image?: File | null;
    template_parts?: CreateTemplatePartPayload[];
}

export interface CreateTemplatePartStandalonePayload {
    template: string;  // UUID of the template
    position: number;
    canvas_text_template?: object | null;
    canvas_illustration_template?: object | null;
}

export interface UpdateTemplatePartPayload {
    position?: number;
    canvas_text_template?: object | null;
    canvas_illustration_template?: object | null;
}