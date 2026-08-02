export const dynamic = 'force-dynamic';

import { getSiteSettings } from '@/modules/settings/services/getSettings';
import { AboutClient } from '@/modules/about/components/AboutClient';

export async function generateMetadata() {
    const settings = await getSiteSettings();
    return {
        title: `About Us | ${settings.site_name}`,
        description: `Learn about ${settings.site_name}, our handcrafted kubo villas, and our commitment to authentic oceanfront Filipino hospitality.`,
    };
}

export default async function AboutPage() {
    const settings = await getSiteSettings();
    return <AboutClient settings={settings} />;
}