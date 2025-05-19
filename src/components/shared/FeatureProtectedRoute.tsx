// src/components/shared/FeatureProtectedRoute.tsx (fixed version)
'use client';

import React, { useEffect } from 'react';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface FeatureProtectedRouteProps {
    featureName: string;
    children: React.ReactNode;
    fallbackUrl?: string;
}

const FeatureProtectedRoute: React.FC<FeatureProtectedRouteProps> = ({
                                                                         featureName,
                                                                         children,
                                                                         fallbackUrl = '/'
                                                                     }) => {
    const { isFeatureEnabled, loading } = useFeatureFlags();
    const router = useRouter();

    // Always declare useEffect, but conditionally perform actions inside it
    useEffect(() => {
        // Only redirect if the feature is disabled and we're done loading
        if (!loading && !isFeatureEnabled(featureName)) {
            router.push(fallbackUrl);
        }
    }, [loading, isFeatureEnabled, featureName, router, fallbackUrl]);

    // Show loading state while checking flags
    if (loading) {
        return <LoadingSpinner message="در حال بارگذاری..." />;
    }

    // If feature is disabled, show a loading spinner while redirect happens
    if (!isFeatureEnabled(featureName)) {
        return <LoadingSpinner message="در حال انتقال..." />;
    }

    // Feature is enabled, render children
    return <>{children}</>;
};

export default FeatureProtectedRoute;