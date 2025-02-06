export interface StoryResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
}

export interface StoryTemplate {
    id: string;  // UUID
    title: string;
    description: string;
    activity_type: 'WRITE_FOR_DRAWING' | string;
    template_parts: TemplatePart[];
}

export interface TemplatePart {
    id: string;  // UUID
    position: number;
    prompt_text: string;
    illustration: string | null;
}