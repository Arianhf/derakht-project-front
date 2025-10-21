'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';
import { useUser } from '@/contexts/UserContext';

export default function ClarityAnalytics() {
    const { user } = useUser();

    useEffect(() => {
        const projectId = "tt4pgv0xmu";

        // Only initialize Clarity in production
        if (projectId && typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
            Clarity.init(projectId);
        }
    }, []);

    useEffect(() => {
        // Only identify in production
        if (user && typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
            Clarity.identify(
                user.id,
                undefined,
                undefined,
                `${user.first_name} ${user.last_name}`.trim()
            );
            Clarity.setTag("userEmail", user.email);
            Clarity.setTag("hasPhoneNumber", user.phone_number ? "yes" : "no");
        }
    }, [user]);

    return null;
}