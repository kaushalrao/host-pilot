import {
    CalendarCheck, MapPin, Coffee, Wifi,
    Utensils, MessageCircle, LogOut, Home, FileText
} from 'lucide-react';
import React from 'react';

export const AVAILABLE_ICONS: Record<string, React.ElementType> = {
    CalendarCheck, MapPin, Coffee, Wifi, Utensils, LogOut, MessageCircle, Home, FileText
};

export const VARIABLE_CATEGORIES = {
    "Property Details": ['propertyName', 'wifiName', 'wifiPass', 'locationLink', 'propertyLink', 'checkInTime', 'checkOutTime', 'baseGuests'],
    "Guest & Booking": ['guestName', 'numberOfGuests', 'nights', 'checkInDate', 'checkOutDate'],
    "Host & Contact": ['hostName', 'coHostName', 'contactPrimary', 'contactSecondary'],
    "Financials": ['totalAmount', 'advancePaid', 'balanceDue', 'basePrice', 'extraGuestPrice']
};

export const getIconForTemplate = (label: string): string => {
    const lowerLabel = label.toLowerCase();

    if (lowerLabel.includes('booking') || lowerLabel.includes('confirm') || lowerLabel.includes('reservation')) return 'CalendarCheck';
    if (lowerLabel.includes('wifi') || lowerLabel.includes('internet') || lowerLabel.includes('network')) return 'Wifi';
    if (lowerLabel.includes('location') || lowerLabel.includes('map') || lowerLabel.includes('direction') || lowerLabel.includes('address')) return 'MapPin';
    if (lowerLabel.includes('welcome') || lowerLabel.includes('intro') || lowerLabel.includes('hello')) return 'Coffee';
    if (lowerLabel.includes('checkout') || lowerLabel.includes('check-out') || lowerLabel.includes('bye') || lowerLabel.includes('departure')) return 'LogOut';
    if (lowerLabel.includes('prop') || lowerLabel.includes('house') || lowerLabel.includes('detail') || lowerLabel.includes('guide')) return 'FileText';
    if (lowerLabel.includes('food') || lowerLabel.includes('dining') || lowerLabel.includes('restaurant') || lowerLabel.includes('eat')) return 'Utensils';

    return 'MessageCircle';
};

export const formatDate = (dateStr: string): string => {
    if (!dateStr) return '...';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const calculateNights = (inDate: string, outDate: string): number => {
    if (!inDate || !outDate) return 0;
    const [y1, m1, d1] = inDate.split('-').map(Number);
    const [y2, m2, d2] = outDate.split('-').map(Number);
    const start = new Date(y1, m1 - 1, d1);
    const end = new Date(y2, m2 - 1, d2);
    if (end <= start) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN').format(amount);

export const processTemplate = (templateStr: string, data: Record<string, string | number>): string => {
    return templateStr.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] !== undefined ? String(data[key]) : match;
    });
};
