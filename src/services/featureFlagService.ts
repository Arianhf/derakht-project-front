// src/services/featureFlagService.ts
import api from './api';

export interface FeatureFlag {
    name: string;
    enabled: boolean;
    description?: string;
}

export const featureFlagService = {
    // Get all feature flags
    getAllFlags: async (): Promise<FeatureFlag[]> => {
        // For development, you can use local flags
        // if (process.env.NODE_ENV === 'development') {
        //     return getLocalFeatureFlags();
        // }

        try {
            const response = await api.get('/v2/feature-flags/');

            // Backend returns array directly, not paginated response
            if (Array.isArray(response.data)) {
                return response.data;
            }

            // Fallback: check if response has paginated structure
            if (response.data.results && Array.isArray(response.data.results)) {
                return response.data.results;
            }

            return [];
        } catch (error) {
            // Error fetching feature flags - fall back to local flags
            return getLocalFeatureFlags();
        }
    },

    // Check if a specific feature is enabled
    isFeatureEnabled: async (featureName: string): Promise<boolean> => {
        // For development, allow enabling flags via localStorage
        if (process.env.NODE_ENV === 'development') {
            // Check localStorage first
            const localOverride = localStorage.getItem(`feature_${featureName}`);
            if (localOverride !== null) {
                return localOverride === 'true';
            }

            // Fall back to development defaults
            const localFlags = getLocalFeatureFlags();
            const flag = localFlags.find(f => f.name === featureName);
            return flag?.enabled || false;
        }

        try {
            const response = await api.get(`/v2/feature-flags/${featureName}/`);
            return response.data.enabled || false;
        } catch (error) {
            // Error checking feature flag - default to disabled
            return false;
        }
    }
};

// Development feature flags
const getLocalFeatureFlags = (): FeatureFlag[] => {
    return [
        { name: 'story_creation', enabled: true, description: 'Story creation feature' },
        { name: 'illustrate_story', enabled: true, description: 'Story illustration feature' },
        { name: 'admin_dashboard', enabled: true, description: 'Admin dashboard access' },
        { name: 'complete_story', enabled: true, description: 'Story completion feature' },

    ];
};