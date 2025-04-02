'use client';

import React from 'react';
import LoginPage from '@/components/login/LoginPage';
import { Toaster } from 'react-hot-toast';

export default function Login() {
    return (
        <>
            <Toaster position="top-center" />
            <LoginPage />
        </>
    );
}