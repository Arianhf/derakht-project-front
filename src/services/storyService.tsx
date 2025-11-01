// src/services/storyService.tsx
import api from './api';
import { StoryTemplate, StoryResponse, Story, StoryPart } from '@/types/story';

export const storyService = {
  getAllStories: async (): Promise<StoryResponse<StoryTemplate>> => {
    const response = await api.get('/stories/');
    return response.data;
  },

  getStoryById: async (id: string): Promise<Story> => {
    const response = await api.get(`/stories/${id}/`);
    return response.data;
  },

  createStory: async (storyData: FormData): Promise<StoryTemplate> => {
    const response = await api.post('v2/stories/', storyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateStory: async (id: string, storyData: FormData): Promise<StoryTemplate> => {
    const response = await api.put(`v2/stories/${id}/`, storyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  addStoryPart: async (storyId: string, storyPartTemplateId: string, text: string): Promise<StoryPart> => {
    const response = await api.post(`/api/stories/${storyId}/add_part/`, {
      text,
      story_part_template_id: storyPartTemplateId,
    });
    return response.data;
  },

  finishStory: async (storyId: string, title: string): Promise<StoryTemplate> => {
    const response = await api.post(`/api/stories/${storyId}/finish/`, { title });
    return response.data;
  },

  getApiStories: async (): Promise<StoryResponse<Story>> => {
    const response = await api.get('/stories/');
    return response.data;
  },

  uploadImageForPart: async (formData: FormData) => {
    const response = await api.post('/stories/upload-part-image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  finalizeStory: async (storyId: string, title: string) => {
    const response = await api.post(`/stories/${storyId}/finalize/`, { title });
    return response.data;
  },

  // Upload cover image for a story
  uploadStoryCoverImage: async (storyId: string, imageFile: File): Promise<Story> => {
    const formData = new FormData();
    formData.append('cover_image', imageFile);

    const response = await api.post(`/stories/${storyId}/upload_cover/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Set story configuration (colors)
  setStoryConfig: async (
    storyId: string,
    config: { background_color?: string | null; font_color?: string | null }
  ): Promise<Story> => {
    const response = await api.post(`/stories/${storyId}/set_config/`, config);
    return response.data;
  }
};