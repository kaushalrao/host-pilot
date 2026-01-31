import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { APP_URLS } from '../lib/urls';

export interface CalendarService {
    fetchExternal(url: string): Promise<{ start: string, end: string, summary: string }[]>;
}

const parseICal = (text: string): { start: string, end: string, summary: string }[] => {
    const events: { start: string, end: string, summary: string }[] = [];
    const eventBlocks = text.split('BEGIN:VEVENT');

    for (const block of eventBlocks) {
        const dtStartMatch = block.match(/DTSTART(?:;[^:]+)*:(\d{8})/);
        const dtEndMatch = block.match(/DTEND(?:;[^:]+)*:(\d{8})/);
        const summaryMatch = block.match(/SUMMARY:(.*)/);

        if (dtStartMatch && dtEndMatch) {
            const s = dtStartMatch[1];
            const e = dtEndMatch[1];
            const formatDate = (d: string) => `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6, 8)}`;

            events.push({
                start: formatDate(s),
                end: formatDate(e),
                summary: summaryMatch ? summaryMatch[1].trim() : 'Booked'
            });
        }
    }
    return events;
};

export const defaultCalendarService: CalendarService = {
    fetchExternal: async (url: string) => {
        try {
            if (Capacitor.isNativePlatform()) {
                // Mobile: Use CapacitorHttp to bypass CORS
                const response = await CapacitorHttp.get({ url });
                if (response.status === 200) {
                    const text = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
                    return parseICal(text);
                }
            } else {
                // Web: Use proxy API to avoid CORS
                const res = await fetch(`${APP_URLS.API.CALENDAR_PROXY}?url=${encodeURIComponent(url)}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.events) return data.events;
                }
            }
        } catch (error) {
            console.error("Error fetching calendar:", url, error);
        }
        return [];
    }
};
