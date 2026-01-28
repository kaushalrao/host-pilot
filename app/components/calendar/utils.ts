import { CalendarEvent } from "@/app/lib/types";
import { format, isBefore } from "date-fns";

const isDateBlocked = (dateStr: string, blockedDates: { start: string, end: string }[], variant: 'check-in' | 'check-out' = 'check-in'): boolean => {
    // Check-out Blocked: check-out > start AND check-out <= end
    if (variant === 'check-out') {
        return blockedDates.some(range => dateStr > range.start && dateStr <= range.end);
    }
    // Check-in (default)
    // Blocked if: day >= start && day < end
    return blockedDates.some(range => dateStr >= range.start && dateStr < range.end);
};

export const isTurnoverDate = (dateStr: string, blockedDates: { start: string, end: string }[], variant: 'check-in' | 'check-out' = 'check-in'): boolean => {
    return blockedDates.some(range => {
        if (variant === 'check-in') return dateStr === range.end;
        if (variant === 'check-out') return dateStr === range.start;
        return false;
    });
};

export const getBlockMeta = (day: Date, blockedDates: CalendarEvent[]) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const event = blockedDates.find(e => dayStr >= e.start && dayStr < e.end);
    return event ? { source: event.source, color: event.color } : null;
};

export const isBlocked = (day: Date, blockedDates: CalendarEvent[], variant: 'check-in' | 'check-out' = 'check-in') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isBefore(day, today)) return true;
    return isDateBlocked(format(day, 'yyyy-MM-dd'), blockedDates, variant);
};
