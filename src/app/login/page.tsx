'use client';

import React, {Suspense} from 'react';
import LoginPage from '@/components/login/LoginPage';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function Login() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Toaster position="top-center" />
            <LoginPage />
        </Suspense>
    );
}