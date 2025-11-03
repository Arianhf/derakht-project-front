// src/contexts/FeatureFlagContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { featureFlagService, FeatureFlag } from '@/services/featureFlagService';

interface FeatureFlagContextType {
    flags: Record<string, boolean>;
    isFeatureEnabled: (featureName: string) => boolean;
    loading: boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [flags, setFlags] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlags = async () => {
            try {
                const featureFlags = await featureFlagService.getAllFlags();
                const flagsMap: Record<string, boolean> = {};

                featureFlags.forEach(flag => {
                    flagsMap[flag.name] = flag.enabled;
                });

                setFlags(flagsMap);
            } catch (error) {
                // Error loading feature flags - silently handle in production
            } finally {
                setLoading(false);
            }
        };

        fetchFlags();
    }, []);

    const isFeatureEnabled = (featureName: string): boolean => {
        // For development, check localStorage for overrides
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            const localOverride = localStorage.getItem(`feature_${featureName}`);
            if (localOverride !== null) {
                return localOverride === 'true';
            }
        }

        return flags[featureName] || false;
    };

    return (
        <FeatureFlagContext.Provider value={{ flags, isFeatureEnabled, loading }}>
            {children}
        </FeatureFlagContext.Provider>
    );
};

export const useFeatureFlags = () => {
    const context = useContext(FeatureFlagContext);
    if (context === undefined) {
        throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
    }
    return context;
};