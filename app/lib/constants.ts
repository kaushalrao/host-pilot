import { GuestDetails } from './types';

export const DEFAULT_GUEST_DETAILS: GuestDetails = {
    guestName: '',
    numberOfGuests: 2,
    advancePaid: 0,
    checkInDate: '',
    checkOutDate: ''
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
