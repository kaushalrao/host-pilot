import { useState, useMemo, useCallback } from 'react';
import {
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    parseISO,
} from 'date-fns';

export const useCalendar = (initialDate?: string) => {
    const [currentMonth, setCurrentMonth] = useState(() =>
        initialDate ? parseISO(initialDate) : new Date()
    );

    const nextMonth = useCallback(() => setCurrentMonth(prev => addMonths(prev, 1)), []);
    const prevMonth = useCallback(() => setCurrentMonth(prev => subMonths(prev, 1)), []);
    const goToDate = useCallback((date: string) => setCurrentMonth(parseISO(date)), []);

    const weeks = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [currentMonth]);

    return {
        currentMonth,
        nextMonth,
        prevMonth,
        goToDate,
        weeks, // 'days' is a bit ambiguous, 'weeks' implies the grid logic usually, but here it's flat array of days
        days: weeks // aliasing for clarity
    };
};
