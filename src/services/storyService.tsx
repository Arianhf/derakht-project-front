import api from './api';
import {StoryTemplate, StoryResponse, Story} from '@/types/story';

export const storyService = {
    getAllStories: async (): Promise<StoryResponse<StoryTemplate>> => {
        const response = await api.get('v2/stories/');
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
    }
};
