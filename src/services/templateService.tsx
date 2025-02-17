import api from "@/services/api";

export const templateService = {
    getTemplates: async (activityType: string) => {
        const response = await api.get(`/templates/?activity_type=${activityType}`);
        return response.data;
    },

    startStory: async (templateId: number) => {
        const response = await api.post(`/templates/${templateId}/start_story`);
        return response.data;
    }
};
