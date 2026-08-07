import { createClient } from '@/modules/shared/lib/supabase/server';
import type { Room } from '@/modules/shared/types/database.types';

export async function getRooms(includeHidden = false): Promise<Room[]> {
    try {
        const supabase = await createClient();
        let query = supabase.from('rooms').select('*').order('price_per_night', { ascending: true });

        // Filter out hidden / maintenance rooms for public guest views
        if (!includeHidden) {
            query = query.or('is_hidden.is.null,is_hidden.eq.false');
        }

        const { data, error } = await query;

        if (error || !data || data.length === 0) {
            return getFallbackRooms();
        }
        return data;
    } catch {
        return getFallbackRooms();
    }
}

// Fallback data if Supabase isn't connected yet
function getFallbackRooms(): Room[] {
    return [
        {
            id: '1',
            name: 'Oceanfront Horizon King',
            slug: 'oceanfront-horizon-king',
            tagline: 'Panoramic Pacific views',
            description: 'Unobstructed ocean views featuring floor-to-ceiling glass doors, private balcony, and teak furnishings.',
            price_per_night: 380,
            max_guests: 2,
            bed_type: '1 King Bed',
            size_sqm: 48,
            images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
            is_available: true,
            is_hidden: false,
        },
        {
            id: '2',
            name: 'Coastal Sunset Suite',
            slug: 'coastal-sunset-suite',
            tagline: 'Golden hour perfection',
            description: 'Spacious suite with deep soaking bath, ocean-facing outdoor daybed, and complimentary evening aperitifs.',
            price_per_night: 520,
            max_guests: 3,
            bed_type: '1 Super King Bed',
            size_sqm: 65,
            images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'],
            is_available: true,
            is_hidden: false,
        },
    ];
}