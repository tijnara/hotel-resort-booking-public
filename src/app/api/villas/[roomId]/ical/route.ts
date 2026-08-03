import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/modules/shared/lib/supabase/server';

// Format ISO date (YYYY-MM-DD) to iCal DATE format (YYYYMMDD)
function formatICalDate(dateStr: string): string {
    return dateStr.replace(/-/g, '');
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { roomId } = await params;

        if (!roomId) {
            return new NextResponse('Room ID is required', { status: 400 });
        }

        // Use the project's built-in server Supabase client
        const supabase = await createClient();

        // 1. Fetch Room Details
        const { data: room, error: roomErr } = await supabase
            .from('rooms')
            .select('name')
            .eq('id', roomId)
            .single();

        if (roomErr || !room) {
            return new NextResponse('Villa not found', { status: 404 });
        }

        // 2. Fetch all confirmed and pending reservations for this room
        const { data: bookings, error: bookingsErr } = await supabase
            .from('bookings')
            .select('id, check_in, check_out, created_at, status')
            .eq('room_id', roomId)
            .in('status', ['confirmed', 'pending']);

        if (bookingsErr) {
            console.error('Failed to fetch room bookings for iCal:', bookingsErr);
            return new NextResponse('Internal Server Error', { status: 500 });
        }

        const roomName = room.name || 'Kubo Villa';
        const nowFormatted = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        // 3. Build iCal (.ics) string
        const icalContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Seaview Kubo Resort//Direct Booking Engine//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            `X-WR-CALNAME:${roomName} - Seaview Resort Calendar`,
            `X-WR-CALDESC:Direct booking reservations for ${roomName}`,
        ];

        if (bookings && bookings.length > 0) {
            bookings.forEach((booking) => {
                const dtStart = formatICalDate(booking.check_in);
                const dtEnd = formatICalDate(booking.check_out);
                const uid = `booking-${booking.id}@seaviewkubo.com`;

                icalContent.push(
                    'BEGIN:VEVENT',
                    `UID:${uid}`,
                    `DTSTAMP:${nowFormatted}`,
                    `DTSTART;VALUE=DATE:${dtStart}`,
                    `DTEND;VALUE=DATE:${dtEnd}`,
                    `SUMMARY:Reserved - ${roomName} (${booking.status.toUpperCase()})`,
                    `DESCRIPTION:Direct website reservation #${booking.id.slice(0, 8).toUpperCase()}`,
                    'STATUS:CONFIRMED',
                    'END:VEVENT'
                );
            });
        }

        icalContent.push('END:VCALENDAR');

        const icalBody = icalContent.join('\r\n');

        // 4. Return as text/calendar file with attachment headers
        return new NextResponse(icalBody, {
            status: 200,
            headers: {
                'Content-Type': 'text/calendar; charset=utf-8',
                'Content-Disposition': `attachment; filename="${roomName.toLowerCase().replace(/\s+/g, '-')}-calendar.ics"`,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
    } catch (err: unknown) {
        console.error('Unexpected error generating iCal:', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}