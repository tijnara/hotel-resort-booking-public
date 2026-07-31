import { getSiteSettings } from '@/modules/settings/services/getSettings';
import { AboutClient } from '@/modules/about/components/AboutClient';

export const metadata = {
    title: 'About Us | Seaview Resort',
    description: 'Learn about Seaview Resort, our handcrafted kubo villas, and our commitment to authentic oceanfront Filipino hospitality.',
};

export default async function AboutPage() {
    const settings = await getSiteSettings();
    return <AboutClient settings={settings} />;
}