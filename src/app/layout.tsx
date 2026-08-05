import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { getSiteSettings } from '@/modules/settings/services/getSettings';
import './globals.css';

export const dynamic = 'force-dynamic';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();

    const title = settings.meta_title?.trim() || `${settings.site_name || 'SEAVIEW'} | Executive Coastal Kubo Villas & Resort`;

    return {
        title,
        description: settings.hero_description || 'Handcrafted beachfront Kubo villas blending ancestral Philippine architecture with modern luxury.',
    };
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        </body>
        </html>
    );
}