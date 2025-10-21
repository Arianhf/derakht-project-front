'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export default function ClarityAnalytics() {
    useEffect(() => {
        const projectId = "tt4pgv0xmu";

        if (projectId && typeof window !== 'undefined') {
            Clarity.init(projectId);
        }
    }, []);

    return null;
}