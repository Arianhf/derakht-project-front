import api from './api';
import { StoryTemplate, StoryResponse } from '../types/story';

export const storyService = {
    getAllStories: async (): Promise<StoryResponse<StoryTemplate>> => {
        const response = await api.get('v2/stories/');
        return response.data;
    },

    //localhost:8000/api/stories/templates/ebd15be0-700a-47d1-b749-0a9e20ed99c1/
    getStoryById: async (id: string): Promise<StoryTemplate> => {
        const response = await api.get(`/stories/templates/${id}/`);
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
    }
};
