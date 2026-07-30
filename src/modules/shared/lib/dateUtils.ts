import { BookedDateRange } from '@/modules/bookings/actions/getRoomBookings';

/**
 * Converts date ranges into a Set of occupied YYYY-MM-DD date strings.
 * Note: Check-out day is NOT included in occupied nights because a new guest can check in that afternoon.
 */
export function getOccupiedDatesSet(ranges: BookedDateRange[]): Set<string> {
    const occupiedSet = new Set<string>();

    ranges.forEach(({ check_in, check_out }) => {
        const current = new Date(check_in);
        const end = new Date(check_out);

        while (current < end) {
            const year = current.getFullYear();
            const month = String(current.getMonth() + 1).padStart(2, '0');
            const day = String(current.getDate()).padStart(2, '0');

            occupiedSet.add(`${year}-${month}-${day}`);
            current.setDate(current.getDate() + 1);
        }
    });

    return occupiedSet;
}

/**
 * Checks if a selected Check-In and Check-Out range overlaps any existing booking.
 */
export function isRangeOverlapping(checkIn: string, checkOut: string, occupiedSet: Set<string>): boolean {
    const current = new Date(checkIn);
    const end = new Date(checkOut);

    while (current < end) {
        const dateStr = current.toISOString().split('T')[0];
        if (occupiedSet.has(dateStr)) return true;
        current.setDate(current.getDate() + 1);
    }

    return false;
}