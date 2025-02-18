    import api from "@/services/api";

    export const templateService = {
        getTemplates: async (activityType: string) => {
            const response = await api.get(`/stories/templates/?activity_type=${activityType}`);
            return response.data;
        },

        startStory: async (templateId: string) => {
            const response = await api.post(`/stories/templates/${templateId}/start_story/`);
            return response.data;
        }
    };
