import type { MouseEvent, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface FeatureCardProps {
    href: string;
    title: React.ReactNode;
    description: string;
    label: string;
    icon: LucideIcon;
    color: 'indigo' | 'rose' | 'orange' | 'cyan';
    iconRotation?: string;
    iconHoverRotation?: string;
}

export interface IcalFeed {
    id: string;
    name: string;
    url: string;
    color: string;
}

export interface CalendarEvent {
    start: string;
    end: string;
    summary?: string;
    source?: string; // 'airbnb' | 'manual' | 'booking.com' etc
    color?: string;
}

export interface Property {
    id: string;
    name: string;
    hostName: string;
    coHostName: string;
    contactPrimary: string;
    contactSecondary: string;
    checkInTime: string;
    checkOutTime: string;
    wifiName: string;
    wifiPass: string;
    locationLink: string;
    propertyLink: string;
    icalFeeds: IcalFeed[];
    airbnbIcalUrl?: string; // Deprecated, kept for migration
    basePrice: number;
    extraGuestPrice: number;
    baseGuests: number;
}

export interface Template {
    id: string;
    label: string;
    icon: string;
    content: string;
}

export type ViewState = 'home' | 'greeter' | 'settings';

export interface ToastState {
    message: string;
    type: 'success' | 'error';
    visible: boolean;
}

export interface GuestDetails {
    guestName: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    advancePaid: number;
    discount?: number;
    phoneNumber?: string;
}

export interface Guest extends GuestDetails {
    id: string;
    createdAt: number;
    firstName: string;
    status: 'upcoming' | 'active' | 'completed' | 'cancelled';
    propName?: string;
    phoneNumber?: string;
    email?: string;
    totalAmount?: number;
}

export interface MaintenanceIssue {
    id: string;
    propertyId: string;
    title: string;
    status: 'pending' | 'in-progress' | 'fixed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    createdAt: number;
}

export interface VariableEditorRef {
    insert: (text: string) => void;
}

export interface TabControlProps {
    options: { id: string; label: string; icon?: ReactNode }[];
    activeId: string;
    onChange: (id: any) => void;
    className?: string;
}

export interface GuestDirectoryProps {
    onSelect?: (guest: Guest) => void;
    mode?: 'page' | 'picker';
    className?: string;
}

export interface GuestCardProps {
    guest: Guest;
    mode: 'page' | 'picker';
    onSelect?: (guest: Guest) => void;
    onDelete?: (e: MouseEvent, id: string) => void;
}

export interface GuestFiltersProps {
    search: string;
    setSearch: (value: string) => void;
    selectedMonth: string;
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
    toggleAllMonths: () => void;
    statusFilter: 'upcoming' | 'past' | 'all';
    setStatusFilter: (filter: 'upcoming' | 'past' | 'all') => void;
    mode: 'page' | 'picker';
}

export interface GuestFormProps {
    details: GuestDetails;
    onChange: (details: GuestDetails) => void;
    templateContent?: string;
    blockedDates?: CalendarEvent[];
    onSaveGuest?: () => void;
    onOpenDirectory?: () => void;
    icalFeeds?: IcalFeed[];
}
