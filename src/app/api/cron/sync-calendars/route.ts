import { NextResponse } from 'next/server';
import { createClient } from '@/modules/shared/lib/supabase/server';
import ical, { VEvent } from 'node-ical';

export async function GET() {
    try {
        const supabase = await createClient();

        // 1. Fetch all rooms that have an Airbnb or Booking.com iCal URL set
        const { data: rooms, error: roomsErr } = await supabase
            .from('rooms')
            .select('id, name, airbnb_ical_url, booking_ical_url');

        if (roomsErr || !rooms) {
            return NextResponse.json({ success: false, message: 'Failed to fetch rooms' }, { status: 500 });
        }

        let syncedCount = 0;

        for (const room of rooms) {
            const otaUrls = [
                { source: 'Airbnb', url: room.airbnb_ical_url },
                { source: 'Booking.com', url: room.booking_ical_url },
            ].filter((item) => item.url && item.url.trim() !== '');

            for (const { source, url } of otaUrls) {
                try {
                    // Fetch the external .ics file from Airbnb / Booking.com
                    const events = await ical.async.fromURL(url!);

                    for (const key in events) {
                        const event = events[key];

                        if (event && event.type === 'VEVENT') {
                            const vEvent = event as VEvent;

                            if (vEvent.start && vEvent.end) {
                                const checkIn = new Date(vEvent.start).toISOString().split('T')[0];
                                const checkOut = new Date(vEvent.end).toISOString().split('T')[0];

                                // Check if this external booking is already saved in Supabase
                                const { data: existing } = await supabase
                                    .from('bookings')
                                    .select('id')
                                    .eq('room_id', room.id)
                                    .eq('check_in', checkIn)
                                    .eq('check_out', checkOut)
                                    .single();

                                if (!existing) {
                                    // Insert blocked date range into Supabase
                                    await supabase.from('bookings').insert({
                                        room_id: room.id,
                                        guest_name: `${source} Guest`,
                                        guest_email: `reserved@${source.toLowerCase().replace(/\s+/g, '')}.com`,
                                        guest_phone: 'N/A',
                                        check_in: checkIn,
                                        check_out: checkOut,
                                        guests_count: 1,
                                        total_price: 0,
                                        payment_method: source.toLowerCase(),
                                        status: 'confirmed', // Automatically blocks on your website calendar!
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
            message: `Calendar sync complete. ${syncedCount} new external bookings imported.`,
        });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error during calendar sync';
        console.error('Calendar Sync Error:', err);
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
}
