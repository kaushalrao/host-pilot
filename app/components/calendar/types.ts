import { CalendarEvent, IcalFeed } from '../../lib/types';

export interface DatePickerProps {
    date: string;
    onChange: (date: string) => void;
    label: string;
    blockedDates?: CalendarEvent[];
    variant?: 'check-in' | 'check-out';
    align?: 'left' | 'right';
    otherDate?: string;
    icalFeeds?: IcalFeed[];
}

export interface CalendarDayProps {
    day: Date;
    currentMonth: Date;
    selectedDate?: Date;
    comparisonDate?: Date;
    blockedDates: CalendarEvent[];
    variant: 'check-in' | 'check-out';
    onSelect: (day: Date) => void;
    isBlocked: boolean;
    blockMeta: { source?: string; color?: string } | null;
}

export interface CalendarHeaderProps {
    currentMonth: Date;
    onNext: () => void;
    onPrev: () => void;
}
