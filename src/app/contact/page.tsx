export const dynamic = 'force-dynamic';

import { getSiteSettings } from '@/modules/settings/services/getSettings';
import { ContactClient } from '@/modules/contact/components/ContactClient';

export async function generateMetadata() {
    const settings = await getSiteSettings();
    const siteName = settings.site_name || 'SEAVIEW';

    return {
        title: settings.contact_meta_title?.trim() || `Contact Us | ${siteName}`,
        description: 'Connect with our resort desk for beachfront villa reservations, private stays, and guest assistance.',
    };
}

export default async function ContactPage() {
    const settings = await getSiteSettings();
    return <ContactClient settings={settings} />;
}