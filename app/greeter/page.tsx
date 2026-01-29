"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Check, Copy, MessageCircle, PenTool, Eye, X, Loader2 } from 'lucide-react';
import { GuestDetails, Guest, CalendarEvent } from '../lib/types';
import { DEFAULT_GUEST_DETAILS } from '../lib/constants';
import { calculateNights, formatDate, formatCurrency, processTemplate, fetchExternalCalendar, openWhatsApp } from '../lib/utils';
import { PropertyDock } from '../components/PropertyDock';
import { Portal } from '../components/ui/Portal';
import { GuestForm } from '../components/guests/GuestForm';
import { TemplateSelector } from '../components/TemplateSelector';
import { PreviewPhone } from '../components/PreviewPhone';
import { GuestDirectory } from '../components/guests/GuestDirectory';
import { useApp } from '../components/providers/AppProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { db, appId } from '../lib/firebase';
import { collection, addDoc, updateDoc, doc, getDoc, query, where, getDocs } from 'firebase/firestore';

import { Suspense } from 'react';

function GreeterContent() {
    const { properties, templates, showToast, user } = useApp();
    const router = useRouter();
    const searchParams = useSearchParams();
    const guestIdParam = searchParams.get('guestId');

    const [selectedPropId, setSelectedPropId] = useState('');
    const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
    const [guestDetails, setGuestDetails] = useState<GuestDetails>(DEFAULT_GUEST_DETAILS);
    const [currentGuestId, setCurrentGuestId] = useState<string | null>(null);
    const [selectedTempId, setSelectedTempId] = useState('');
    const [copied, setCopied] = useState(false);
    const [blockedDates, setBlockedDates] = useState<CalendarEvent[]>([]);

    // Guest Directory State
    const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);

    const isGuestLoadingRef = React.useRef(false);

    const handleSelectGuest = React.useCallback((guest: Guest) => {
        if (guest?.propName) {
            const prop = properties.find(p => p.name === guest.propName);
            if (prop && prop.id !== selectedPropId) {
                isGuestLoadingRef.current = true;
                setSelectedPropId(prop.id);
            }
        }

        setGuestDetails({
            guestName: guest.guestName,
            numberOfGuests: guest.numberOfGuests,
            advancePaid: guest.advancePaid,
            discount: guest.discount || 0,
            checkInDate: guest.checkInDate,
            checkOutDate: guest.checkOutDate,
            phoneNumber: guest.phoneNumber || ''
        });
        setCurrentGuestId(guest.id);
        setIsGuestbookOpen(false);
        showToast("Guest details loaded", "success");
    }, [properties, selectedPropId, showToast]);

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    // Fetch Guest from URL if present
    useEffect(() => {
        const loadGuestFromUrl = async () => {
            if (!user || !guestIdParam) return;

            try {
                const docRef = doc(db, `artifacts/${appId}/users/${user.uid}/guests`, guestIdParam);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const guest = { id: docSnap.id, ...docSnap.data() } as Guest;
                    handleSelectGuest(guest);
                    // Clear param so a refresh doesn't re-fetch if we navigate away inside app?
                    // Or keep it. Let's keep it simple for now.
                    // Actually, let's replace URL to be clean if desired, but user might want to refresh.
                } else {
                    showToast("Guest not found", "error");
                }
            } catch (err) {
                console.error("Error loading guest:", err);
            }
        };

        if (user && guestIdParam && !currentGuestId) {
            loadGuestFromUrl();
        }
    }, [user, guestIdParam, currentGuestId, handleSelectGuest, showToast]);

    useEffect(() => {
        if (!selectedPropId && properties.length > 0) {
            setSelectedPropId(properties[0].id);
        }
    }, [properties, selectedPropId]);

    useEffect(() => {
        if (!selectedTempId && templates.length > 0) {
            setSelectedTempId(templates[0].id);
        }
    }, [templates, selectedTempId]);

    const selectedProperty = properties.find(p => p.id === selectedPropId) || properties[0];

    // Reset dates & guest ID when property changes
    useEffect(() => {
        // Only reset if we are NOT currently loading a guest from URL or explicitly selecting one
        if (!guestIdParam && !isGuestLoadingRef.current) {
            setGuestDetails(prev => ({
                ...prev,
                checkInDate: '',
                checkOutDate: ''
            }));
            setCurrentGuestId(null);
        }
        // Reset the ref after the effect logic runs (if it skipped, it means we consumed the flag)
        if (isGuestLoadingRef.current) {
            isGuestLoadingRef.current = false;
        }
    }, [selectedPropId, guestIdParam]);

    // Fetch Calendar Data (Internal + External)
    useEffect(() => {
        const fetchCalendarData = async () => {
            if (!user?.uid || !selectedProperty) return;

            let allEvents: CalendarEvent[] = [];

            // 1. Fetch Internal Bookings (Host Pilot)
            try {
                const guestsRef = collection(db, `artifacts/${appId}/users/${user.uid}/guests`);
                const q = query(
                    guestsRef,
                    where('propName', '==', selectedProperty.name)
                );

                const querySnapshot = await getDocs(q);
                const internalEvents: CalendarEvent[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data() as Guest;
                    // Only block for valid statuses
                    if (data.status !== 'cancelled' && data.checkInDate && data.checkOutDate) {
                        internalEvents.push({
                            start: data.checkInDate,
                            end: data.checkOutDate,
                            summary: `Hosted: ${data.guestName}`,
                            source: 'manual',
                            color: '#3b82f6' // Host Pilot Blue
                        });
                    }
                });

                allEvents = [...allEvents, ...internalEvents];
            } catch (err) {
                console.error("Error fetching internal bookings:", err);
            }

            // 2. Fetch External iCal Feeds
            const feeds = selectedProperty.icalFeeds || [];

            // Fetch all feeds in parallel
            const feedPromises = feeds.map(async (feed) => {
                const events = await fetchExternalCalendar(feed.url);
                return events.map(e => ({
                    ...e,
                    source: feed.name,
                    color: feed.color
                }));
            });

            try {
                const externalResults = await Promise.all(feedPromises);
                externalResults.forEach(events => {
                    allEvents = [...allEvents, ...events];
                });
            } catch (err) {
                console.error("Error fetching external calendars", err);
                showToast("Some calendars failed to sync", "error");
            }

            setBlockedDates(allEvents);
        };

        fetchCalendarData();
    }, [selectedProperty, user?.uid, showToast]);

    const selectedTemplate = templates.find(t => t.id === selectedTempId) || templates[0];

    const generatedMessage = useMemo(() => {
        if (!selectedProperty || !selectedTemplate) return '';
        const nights = calculateNights(guestDetails.checkInDate, guestDetails.checkOutDate);
        const totalBaseCost = selectedProperty.basePrice * nights;
        const extraGuestsCount = Math.max(0, guestDetails.numberOfGuests - selectedProperty.baseGuests);
        const totalExtraCost = selectedProperty.extraGuestPrice * extraGuestsCount * nights;

        const subTotal = totalBaseCost + totalExtraCost;
        const discount = guestDetails.discount || 0;
        const totalAmount = Math.max(0, subTotal - discount);

        const balanceDue = Math.max(0, totalAmount - guestDetails.advancePaid);

        const data: Record<string, string | number> = {
            guestName: guestDetails.guestName.trim() || 'Guest',
            propertyName: selectedProperty.name,
            hostName: selectedProperty.hostName,
            coHostName: selectedProperty.coHostName,
            contactPrimary: selectedProperty.contactPrimary,
            contactSecondary: selectedProperty.contactSecondary,
            wifiName: selectedProperty.wifiName,
            wifiPass: selectedProperty.wifiPass,
            checkInTime: selectedProperty.checkInTime,
            checkOutTime: selectedProperty.checkOutTime,
            locationLink: selectedProperty.locationLink,
            propertyLink: selectedProperty.propertyLink || '',
            checkInDate: formatDate(guestDetails.checkInDate),
            checkOutDate: formatDate(guestDetails.checkOutDate),
            nights: nights,
            numberOfGuests: guestDetails.numberOfGuests,
            totalAmount: formatCurrency(totalAmount),
            advancePaid: formatCurrency(guestDetails.advancePaid),
            balanceDue: formatCurrency(balanceDue),
            basePrice: formatCurrency(selectedProperty.basePrice),
            extraGuestPrice: formatCurrency(selectedProperty.extraGuestPrice),
            baseGuests: selectedProperty.baseGuests,
        };
        return processTemplate(selectedTemplate.content, data);
    }, [guestDetails, selectedProperty, selectedTemplate]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedMessage);
        setCopied(true);
        showToast('Message copied to clipboard', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsApp = () => {
        openWhatsApp(generatedMessage, guestDetails.phoneNumber);
    };

    const handleSaveGuest = async () => {
        if (!guestDetails.guestName) {
            showToast("Please enter a guest name", "error");
            return;
        }

        try {
            // Calculate Total Amount for saving
            const nights = calculateNights(guestDetails.checkInDate, guestDetails.checkOutDate);
            const totalBaseCost = selectedProperty.basePrice * nights;
            const extraGuestsCount = Math.max(0, guestDetails.numberOfGuests - selectedProperty.baseGuests);
            const totalExtraCost = selectedProperty.extraGuestPrice * extraGuestsCount * nights;
            const subTotal = totalBaseCost + totalExtraCost;
            const discount = guestDetails.discount || 0;
            const totalAmount = Math.max(0, subTotal - discount);

            const guestData: Partial<Guest> = {
                ...guestDetails,
                createdAt: Date.now(),
                status: 'upcoming',
                firstName: guestDetails.guestName.split(' ')[0],
                propName: selectedProperty.name,
                totalAmount: totalAmount
            };

            const path = `artifacts/${appId}/users/${user?.uid}/guests`;

            if (currentGuestId) {
                // Update existing
                await updateDoc(doc(db, path, currentGuestId), guestData);
                showToast("Guest updated!", "success");
            } else {
                // Create new
                const docRef = await addDoc(collection(db, path), guestData);
                setCurrentGuestId(docRef.id);
                showToast("Guest saved to directory!", "success");
            }
        } catch (error) {
            console.error("Error saving guest:", error);
            showToast("Failed to save guest", "error");
        }
    };

    return (
        <div className="pb-24 md:pb-0 flex flex-col gap-6 md:gap-10 h-full relative">
            <div className="hidden lg:block mt-8 animate-fade-in">
                <PropertyDock properties={properties} selectedId={selectedPropId} onSelect={setSelectedPropId} />
            </div>

            {/* Mobile Header Controls */}
            <div className="lg:hidden w-[calc(100%+2rem)] -mx-4 sticky top-[72px] z-40 bg-[#0f172a]/95 backdrop-blur-xl -mt-4 py-3 px-4 border-b border-white/5 animate-fade-in">
                <PropertyDock properties={properties} selectedId={selectedPropId} onSelect={setSelectedPropId} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-1 animate-fade-in">
                {/* Left Section: Form and Templates */}
                <div className={`lg:col-span-8 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
                        <div className="space-y-6 md:space-y-8 relative z-20">
                            <GuestForm
                                details={guestDetails}
                                onChange={setGuestDetails}
                                templateContent={selectedTemplate?.content}
                                blockedDates={blockedDates}
                                onSaveGuest={handleSaveGuest}
                                onOpenDirectory={() => setIsGuestbookOpen(true)}
                                icalFeeds={selectedProperty?.icalFeeds}
                            />
                        </div>

                        <div className="sticky top-24">
                            {templates.length > 0 && (
                                <TemplateSelector templates={templates} selectedId={selectedTempId} onSelect={setSelectedTempId} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Section: Preview Phone */}
                <div className={`lg:col-span-4 lg:sticky lg:top-24 ${mobileTab === 'edit' ? 'hidden lg:block' : 'block'}`}>
                    <PreviewPhone message={generatedMessage} onSend={handleWhatsApp} onCopy={handleCopy} copied={copied} />
                </div>

                {/* Guest Directory Drawer */}
                {isGuestbookOpen && (
                    <Portal>
                        <div className="fixed inset-0 z-[100] flex justify-end">
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsGuestbookOpen(false)} />

                            <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-white/10 shadow-2xl p-6 flex flex-col animate-slide-left">
                                <div className="flex justify-between items-center mb-6 shrink-0">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">Guest Directory</h3>
                                    <button onClick={() => setIsGuestbookOpen(false)} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-hidden">
                                    <GuestDirectory mode="picker" onSelect={handleSelectGuest} className="h-full" />
                                </div>
                            </div>
                        </div>
                    </Portal>
                )}
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10 p-2 z-50 safe-area-bottom">
                <div className="grid grid-cols-4 gap-2 h-14">
                    {/* Editor Tab */}
                    <button
                        onClick={() => setMobileTab('edit')}
                        className={`flex flex-col items-center justify-center rounded-xl transition-all ${mobileTab === 'edit' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-white'}`}
                    >
                        <PenTool size={20} />
                        <span className="text-[10px] font-medium mt-1">Editor</span>
                    </button>

                    {/* Preview Tab */}
                    <button
                        onClick={() => setMobileTab('preview')}
                        className={`flex flex-col items-center justify-center rounded-xl transition-all ${mobileTab === 'preview' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Eye size={20} />
                        <span className="text-[10px] font-medium mt-1">Preview</span>
                    </button>

                    {/* Copy Action */}
                    <button
                        onClick={handleCopy}
                        className="flex flex-col items-center justify-center rounded-xl text-slate-400 hover:text-white active:scale-95 transition-all"
                    >
                        {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                        <span className="text-[10px] font-medium mt-1">Copy</span>
                    </button>

                    {/* WhatsApp Action */}
                    <button
                        onClick={handleWhatsApp}
                        className="flex flex-col items-center justify-center rounded-xl text-slate-400 hover:text-green-400 active:scale-95 transition-all"
                    >
                        <MessageCircle size={20} />
                        <span className="text-[10px] font-medium mt-1">Send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function GreeterPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center p-10"><Loader2 className="animate-spin text-orange-400" /></div>}>
            <GreeterContent />
        </Suspense>
    );
}
