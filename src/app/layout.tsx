// src/app/layout.tsx
import { ConditionalProviders } from "@/components/ConditionalProviders";
import { UserProvider } from "@/contexts/UserContext";
import ClarityAnalytics from "@/components/Clarity";
import ErrorBoundary from "@/components/shared/ErrorBoundary/ErrorBoundary";
import "./globals.scss";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'درخت - بلاگ کودکان',
    description: 'وبسایت آموزشی کودکان',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fa" dir="rtl">
        <body>
        <ErrorBoundary>
            <UserProvider>
                <ClarityAnalytics />
                <ConditionalProviders>{children}</ConditionalProviders>
            </UserProvider>
        </ErrorBoundary>
        </body>
        </html>
    );
}