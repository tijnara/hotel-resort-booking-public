export const dynamic = 'force-dynamic';

import { getSiteSettings } from '@/modules/settings/services/getSettings';
import { AboutClient } from '@/modules/about/components/AboutClient';

export async function generateMetadata() {
    const settings = await getSiteSettings();
    const siteName = settings.site_name || 'SEAVIEW';

    return {
        title: settings.about_meta_title?.trim() || `About Us | ${siteName}`,
        description: `Learn about ${siteName}, our handcrafted kubo villas, and our commitment to authentic oceanfront Filipino hospitality.`,
    };
}

export default async function AboutPage() {
    const settings = await getSiteSettings();
    return <AboutClient settings={settings} />;
}