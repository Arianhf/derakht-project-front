// src/app/layout.tsx
import { ConditionalProviders } from "@/components/ConditionalProviders";
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
        <ConditionalProviders>{children}</ConditionalProviders>
        </body>
        </html>
    );
}