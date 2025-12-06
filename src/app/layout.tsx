// src/app/layout.tsx
import { ConditionalProviders } from "@/components/ConditionalProviders";
import { UserProvider } from "@/contexts/UserContext";
import ClarityAnalytics from "@/components/Clarity";
import ErrorBoundary from "@/components/shared/ErrorBoundary/ErrorBoundary";
import "./globals.scss";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        default: 'درخت | پلتفرم قصه‌سازی و آموزش خلاقانه کودکان',
        template: '%s | درخت',
    },
    description: 'درخت - پلتفرم آموزشی و سرگرمی برای کودکان. قصه‌سازی خلاقانه، بسته‌های کتابخوانی و بلاگ آموزشی برای رشد خلاقیت، مهارت‌های زبانی و تفکر خلاق کودکان از یک تا یک‌صد سال',
    keywords: 'قصه‌سازی کودکان، آموزش خلاقانه، بلاگ کودک، بسته کتابخوانی، رشد خلاقیت کودکان، داستان‌های کودکانه، پلتفرم آموزشی کودک، مهارت‌های زبانی کودکان، تفکر خلاق، درخت',
    authors: [{ name: 'تیم درخت' }],
    creator: 'درخت',
    publisher: 'درخت',
    metadataBase: new URL('https://derakht.com'),
    openGraph: {
        type: 'website',
        locale: 'fa_IR',
        url: 'https://derakht.com',
        siteName: 'درخت',
        title: 'درخت | پلتفرم قصه‌سازی و آموزش خلاقانه کودکان',
        description: 'پلتفرم آموزشی و سرگرمی برای کودکان. قصه‌سازی خلاقانه، بسته‌های کتابخوانی و بلاگ آموزشی برای رشد خلاقیت کودکان',
        images: [
            {
                url: '/images/og-default.jpg',
                width: 1200,
                height: 630,
                alt: 'درخت - پلتفرم قصه‌سازی و آموزش خلاقانه کودکان',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'درخت | پلتفرم قصه‌سازی و آموزش خلاقانه کودکان',
        description: 'پلتفرم آموزشی و سرگرمی برای کودکان. قصه‌سازی خلاقانه، بسته‌های کتابخوانی و بلاگ آموزشی',
        images: ['/images/og-default.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        // Add your verification tokens here when available
        // google: 'your-google-verification-token',
        // yandex: 'your-yandex-verification-token',
    },
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