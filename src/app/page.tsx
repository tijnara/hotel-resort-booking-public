export const dynamic = 'force-dynamic';

import { getRooms } from '@/modules/rooms/services/getRooms';
import { getSiteSettings } from '@/modules/settings/services/getSettings';
import { HomeClient } from '@/modules/home/components/HomeClient';

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `${settings.site_name} | Executive Coastal Kubo Villas & Resort`,
    description: settings.hero_description || 'Book your private stay today and experience premium comfort, breathtaking golden hours, and authentic local hospitality.',
  };
}

export default async function HomePage() {
  const [rooms, settings] = await Promise.all([
    getRooms(),
    getSiteSettings(),
  ]);

  return <HomeClient initialRooms={rooms} settings={settings} />;
}