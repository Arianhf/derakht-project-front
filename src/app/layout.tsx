import { ConditionalProviders } from "@/components/ConditionalProviders";
import "./globals.scss";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fa" dir="rtl">
        <head>
            <title>درخت - بلاگ کودکان</title>
            <meta name="description" content="وبسایت آموزشی کودکان" />
        </head>
        <body>
        <ConditionalProviders>{children}</ConditionalProviders>
        </body>
        </html>
    );
}