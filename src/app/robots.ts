import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://derakht.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/_next/',
                    '/private/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/private/',
                ],
            },
            {
                userAgent: 'Bingbot',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/private/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
