export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { getSiteSettings } from '@/modules/settings/services/getSettings';
import { PoliciesClient } from './PoliciesClient';

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    const siteName = settings.site_name || 'SEAVIEW';

    return {
        title: `Resort Policies & Terms | ${siteName}`,
        description: 'Read Seaview guest terms and conditions, cancellation and refund policies, and data privacy rules.',
    };
}

export default async function PoliciesPage() {
    const settings = await getSiteSettings();
    return <PoliciesClient settings={settings} />;
}