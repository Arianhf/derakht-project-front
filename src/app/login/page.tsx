'use client';

import React, {Suspense} from 'react';
import LoginPage from '@/components/login/LoginPage';
import { Toaster } from 'react-hot-toast';
import {Loading} from "@/components/shared/Loading";

export default function Login() {
    return (
        <Suspense fallback={<Loading />}>
            <Toaster position="top-center" />
            <LoginPage />
        </Suspense>
    );
}