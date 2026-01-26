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
    options: { id: string; label: string; icon?: React.ReactNode }[];
    activeId: string;
    onChange: (id: any) => void;
    className?: string;
}
