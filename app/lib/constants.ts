import { GuestDetails } from './types';
import {
    CalendarCheck, MapPin, Coffee, Wifi,
    Utensils, MessageCircle, LogOut, Home, FileText
} from 'lucide-react';
import React from 'react';

export const AVAILABLE_ICONS: Record<string, React.ElementType> = {
    CalendarCheck, MapPin, Coffee, Wifi, Utensils, LogOut, MessageCircle, Home, FileText
};

export const FEATURE_CARD_STYLES = {
    indigo: {
        bg: 'bg-indigo-600',
        shadow: 'hover:shadow-indigo-500/30',
        labelBg: 'bg-indigo-950/30',
        labelText: 'text-indigo-100',
        descText: 'text-indigo-100/80',
        icon: 'text-indigo-400',
    },
    rose: {
        bg: 'bg-rose-600',
        shadow: 'hover:shadow-rose-500/30',
        labelBg: 'bg-rose-950/30',
        labelText: 'text-rose-100',
        descText: 'text-rose-100/80',
        icon: 'text-rose-400',
    },
    orange: {
        bg: 'bg-orange-600',
        shadow: 'hover:shadow-orange-500/30',
        labelBg: 'bg-orange-950/30',
        labelText: 'text-orange-100',
        descText: 'text-orange-100/80',
        icon: 'text-orange-400',
    },
    cyan: {
        bg: 'bg-cyan-600',
        shadow: 'hover:shadow-cyan-500/30',
        labelBg: 'bg-cyan-950/30',
        labelText: 'text-cyan-100',
        descText: 'text-cyan-100/80',
        icon: 'text-cyan-500',
    }
};

export const GUEST_FILTER_OPTIONS = ['all', 'upcoming', 'past'] as const;

export const VARIABLE_CATEGORIES = {
    "Property Details": ['propertyName', 'wifiName', 'wifiPass', 'locationLink', 'propertyLink', 'checkInTime', 'checkOutTime', 'baseGuests'],
    "Guest & Booking": ['guestName', 'numberOfGuests', 'nights', 'checkInDate', 'checkOutDate'],
    "Host & Contact": ['hostName', 'coHostName', 'contactPrimary', 'contactSecondary'],
    "Financials": ['totalAmount', 'advancePaid', 'balanceDue', 'basePrice', 'extraGuestPrice']
};

export const DEFAULT_GUEST_DETAILS: GuestDetails = {
    guestName: '',
    numberOfGuests: 2,
    advancePaid: 0,
    discount: 0,
    checkInDate: '',
    checkOutDate: '',
    phoneNumber: ''
};

export const DEFAULT_PROPERTY_TIMES = {
    checkIn: '13:00',
    checkOut: '11:00'
};

export const DEFAULT_PROPERTY_VALUES = {
    baseGuests: 2,
    basePrice: 0,
    extraGuestPrice: 0
};

export const COLOR_VARIANTS: Record<string, { bg: string, border: string, text: string, icon: string }> = {
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-300', icon: 'text-indigo-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-300', icon: 'text-purple-400' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-300', icon: 'text-rose-400' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-300', icon: 'text-orange-400' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-300', icon: 'text-cyan-400' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-300', icon: 'text-emerald-400' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-300', icon: 'text-blue-400' },
    fuchsia: { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', text: 'text-fuchsia-300', icon: 'text-fuchsia-400' },
};
