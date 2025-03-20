import { ConditionalCartProvider } from "@/components/ConditionalCartProvider";
import "../styles/globals.css";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <ConditionalCartProvider>{children}</ConditionalCartProvider>
        </body>
        </html>
    );
}