import { ConditionalProviders } from "@/components/ConditionalProviders";
import "../styles/globals.css";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <ConditionalProviders>{children}</ConditionalProviders>
        </body>
        </html>
    );
}