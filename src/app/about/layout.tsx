import { Metadata } from 'next';

// SEO Metadata for About page
export const metadata: Metadata = {
    title: 'درباره درخت | ماموریت ما در پرورش خلاقیت کودکان',
    description: 'درخت - پلتفرم قصه‌سازی و آموزش خلاقانه کودکان. تیم ما شامل نویسندگان، نقاشان و متخصصان آموزش کودک است که در سال ۱۴۰۳ گرد هم آمدند تا خلاقیت کودکان را پرورش دهند',
    keywords: 'درباره درخت، ماموریت درخت، تیم درخت، آموزش خلاقانه کودکان، قصه‌سازی، پلتفرم آموزشی کودکان، ارزش‌های درخت، چشم‌انداز درخت',
    openGraph: {
        type: 'website',
        locale: 'fa_IR',
        url: 'https://derakht.com/about',
        siteName: 'درخت',
        title: 'درباره درخت | ماموریت ما در پرورش خلاقیت کودکان',
        description: 'داستان درخت، یک پلتفرم قصه‌سازی و آموزش خلاقانه. تیم ما شامل نویسندگان، نقاشان و متخصصان آموزش کودک',
        images: [
            {
                url: '/images/about-og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'درباره درخت - ماموریت ما',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'درباره درخت | ماموریت ما در پرورش خلاقیت کودکان',
        description: 'داستان درخت، یک پلتفرم قصه‌سازی و آموزش خلاقانه. تیم ما شامل نویسندگان، نقاشان و متخصصان آموزش کودک',
        images: ['/images/about-og-image.jpg'],
    },
    alternates: {
        canonical: 'https://derakht.com/about',
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
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
