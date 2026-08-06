import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
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

    const siteName = settings.site_name || 'SEAVIEW';
    const title = settings.meta_title?.trim() || `${siteName} | Executive Coastal Kubo Villas & Resort`;
    const description = settings.hero_description || 'Handcrafted beachfront Kubo villas blending ancestral Philippine architecture with modern luxury.';
    const ogImage = settings.hero_images?.[0] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=630';

    return {
        metadataBase: new URL('https://seaview-booking-website.vercel.app'),
        title: {
            default: title,
            template: `%s | ${siteName}`,
        },
        description,
        keywords: [
            'Seaview Resort',
            'Beachfront Kubo Villas',
            'Pangasinan Resort',
            'Philippines Staycation',
            'Executive Cabin Suites',
            'Coastal Vacation Rental',
        ],
        openGraph: {
            title,
            description,
            siteName,
            type: 'website',
            locale: 'en_PH',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${siteName} Beachfront Resort Preview`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
        robots: {
            index: true,
            follow: true,
        },
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
        <Analytics />
        </body>
        </html>
    );
}