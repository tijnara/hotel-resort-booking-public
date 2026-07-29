export const dynamic = 'force-dynamic';

import { getSiteSettings } from '@/modules/settings/services/getSettings';
import { ContactClient } from '@/modules/contact/components/ContactClient';

export async function generateMetadata() {
    const settings = await getSiteSettings();
    return {
        title: `Contact Us | ${settings.site_name}`,
        description: 'Connect with our resort desk for beachfront villa reservations, private stays, and guest assistance.',
    };
}

export default async function ContactPage() {
    const settings = await getSiteSettings();
    return <ContactClient settings={settings} />;
}