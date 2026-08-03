import { NextResponse } from 'next/server';
import { createClient } from '@/modules/shared/lib/supabase/server';
import ical, { VEvent } from 'node-ical';

interface OtaChannel {
    source: string;
    url: string;
}

export async function GET() {
    try {
        const supabase = await createClient();

        // Fetch all rooms with dynamic ical_sources and legacy URL columns
        const { data: rooms, error: roomsErr } = await supabase
            .from('rooms')
            .select('id, name, airbnb_ical_url, booking_ical_url, ical_sources');

        if (roomsErr || !rooms) {
            return NextResponse.json({ success: false, message: 'Failed to fetch rooms' }, { status: 500 });
        }

        let syncedCount = 0;

        for (const room of rooms) {
            const otaChannels: OtaChannel[] = [];

            // 1. Read dynamic ical_sources array
            const dynamicSources = (room.ical_sources || []) as Array<{ id: string; name: string; url: string }>;
            for (const item of dynamicSources) {
                if (item.url && item.url.trim() !== '') {
                    otaChannels.push({
                        source: item.name.trim() || 'External OTA',
                        url: item.url.trim(),
                    });
                }
            }

            // 2. Read legacy column URLs if not already in list
            if (
                room.airbnb_ical_url &&
                room.airbnb_ical_url.trim() !== '' &&
                !otaChannels.some((c) => c.source.toLowerCase() === 'airbnb')
            ) {
                otaChannels.push({ source: 'Airbnb', url: room.airbnb_ical_url.trim() });
            }

            if (
                room.booking_ical_url &&
                room.booking_ical_url.trim() !== '' &&
                !otaChannels.some((c) => c.source.toLowerCase().includes('booking'))
            ) {
                otaChannels.push({ source: 'Booking.com', url: room.booking_ical_url.trim() });
            }

            for (const { source, url } of otaChannels) {
                try {
                    // Fetch external .ics file
                    const events = await ical.async.fromURL(url);

                    for (const key in events) {
                        const event = events[key];

                        if (event && event.type === 'VEVENT') {
                            const vEvent = event as VEvent;

                            if (vEvent.start && vEvent.end) {
                                const checkIn = new Date(vEvent.start).toISOString().split('T')[0];
                                const checkOut = new Date(vEvent.end).toISOString().split('T')[0];

                                const { data: existing } = await supabase
                                    .from('bookings')
                                    .select('id')
                                    .eq('room_id', room.id)
                                    .eq('check_in', checkIn)
                                    .eq('check_out', checkOut)
                                    .single();

                                if (!existing) {
                                    const paymentMethodKey = source.toLowerCase().replace(/\s+/g, '_');

                                    await supabase.from('bookings').insert({
                                        room_id: room.id,
                                        guest_name: `${source} Guest`,
                                        guest_email: `reserved@${paymentMethodKey}.internal`,
                                        guest_phone: 'N/A',
                                        check_in: checkIn,
                                        check_out: checkOut,
                                        guests_count: 1,
                                        total_price: 0,
                                        payment_method: paymentMethodKey,
                                        status: 'confirmed', // Blocks dates on website timeline!
                                    });
                                    syncedCount++;
                                }
                            }
                        }
                    }
                } catch (err: unknown) {
                    console.error(`Error syncing ${source} calendar for room ${room.name}:`, err);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Calendar sync complete. ${syncedCount} new external bookings imported across connected booking channels.`,
        });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error during calendar sync';
        console.error('Calendar Sync Error:', err);
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
}