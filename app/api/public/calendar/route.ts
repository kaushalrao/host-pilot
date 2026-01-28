
import { NextRequest, NextResponse } from 'next/server';
import { db, appId } from '../../../lib/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

// Helper to format date for iCal (YYYYMMDD)
const formatICalDate = (dateStr: string) => {
    return dateStr.replace(/-/g, '');
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');
    const propertyId = searchParams.get('propertyId');

    if (!uid || !propertyId) {
        return NextResponse.json({ error: 'Missing uid or propertyId' }, { status: 400 });
    }

    try {
        // 1. Fetch Property to get the name
        // Path: artifacts/{appId}/users/{uid}/properties/{propertyId}
        const propRef = doc(db, `artifacts/${appId}/users/${uid}/properties`, propertyId);
        const propSnap = await getDoc(propRef);

        if (!propSnap.exists()) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        const propertyData = propSnap.data();
        const propertyName = propertyData.name;

        // 2. Fetch Guests matching this property matches logic in GuestDirectory
        // Path: artifacts/{appId}/users/{uid}/guests
        const guestsRef = collection(db, `artifacts/${appId}/users/${uid}/guests`);
        // Filter by propName. 
        // Note: Ensure your Guest type and DB use 'propName'. 
        // If not indexed, this might need fallback, but for now assuming 'propName' is valid field.
        const q = query(guestsRef, where('propName', '==', propertyName));
        const querySnapshot = await getDocs(q);

        let events = '';

        querySnapshot.forEach((doc) => {
            const guest = doc.data();

            // Only export active/upcoming bookings
            // We usually want to block dates for CONFIRMED bookings.
            // Assuming 'upcoming', 'active', 'completed' (past but still occupied?) 
            // Actually, we should probably output all existing bookings that have valid dates
            // regardless of status unless they are 'cancelled'.
            if (guest.status === 'cancelled') return;

            if (guest.checkInDate && guest.checkOutDate) {
                const start = formatICalDate(guest.checkInDate); // YYYYMMDD
                const end = formatICalDate(guest.checkOutDate);   // YYYYMMDD
                // iCal DTEND is exclusive for Dates, so strictly speaking logic might need +1 day
                // but usually reservation systems treat [in, out) or [in, out].
                // Airbnb iCal usually expects DTEND to be the day OF checkout (which is free from noon).
                // Standard: DTSTART:20240101, DTEND:20240103 means nights of 1st and 2nd. Checkout on 3rd.
                // Our data is CheckIn and CheckOut date strings. This perfectly matches the [start, end) logic for full day blocking.

                // UUID/UID
                const uid = doc.id + '@guest-greeter.app';
                const created = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

                events += `BEGIN:VEVENT
DTSTART;VALUE=DATE:${start}
DTEND;VALUE=DATE:${end}
DTSTAMP:${created}
UID:${uid}
SUMMARY:${guest.guestName || 'Guest'} - ${propertyName}
DESCRIPTION:Booked via Host Pilot. Guest: ${guest.guestName}
END:VEVENT
`;
            }
        });

        // 3. Construct iCal File
        const calendarContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Host Pilot//NONSGML Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${propertyName} - Host Pilot
${events}END:VCALENDAR`;

        // 4. Return as text/calendar
        return new NextResponse(calendarContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/calendar; charset=utf-8',
                'Content-Disposition': `attachment; filename="calendar_${propertyId}.ics"`,
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', // Prevent caching so updates are seen
            },
        });

    } catch (error) {
        console.error("iCal Generation Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
