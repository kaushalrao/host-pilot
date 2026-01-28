import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const response = await fetch(url, {
            next: { revalidate: 3600 },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch iCal: ${response.statusText}`);
        }

        const text = await response.text();
        const events: { start: string, end: string, summary: string }[] = [];

        // Manual parsing of VEVENT blocks
        // Split by BEGIN:VEVENT to get each event chunk
        const eventBlocks = text.split('BEGIN:VEVENT');

        for (const block of eventBlocks) {
            // Check for DTSTART and DTEND
            // Regex handles optional parameters like ;VALUE=DATE
            const dtStartMatch = block.match(/DTSTART(?:;[^:]+)*:(\d{8})/);
            const dtEndMatch = block.match(/DTEND(?:;[^:]+)*:(\d{8})/);
            const summaryMatch = block.match(/SUMMARY:(.*)/);

            if (dtStartMatch && dtEndMatch) {
                const s = dtStartMatch[1];
                const e = dtEndMatch[1];

                // Format: YYYYMMDD -> YYYY-MM-DD
                const formatDate = (d: string) => `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6, 8)}`;

                const start = formatDate(s);
                const end = formatDate(e);
                const summary = summaryMatch ? summaryMatch[1].trim() : 'Booked';

                events.push({ start, end, summary });
            }
        }

        return NextResponse.json({ events });
    } catch (error: any) {
        console.error('Calendar Fetch Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch calendar', details: error.toString() }, { status: 500 });
    }
}
