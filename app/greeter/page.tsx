"use client";

import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { Check, Copy, MessageCircle, PenTool, Eye } from 'lucide-react';
import { Property, Template, GuestDetails } from '../lib/types';
import { calculateNights, formatDate, formatCurrency, processTemplate } from '../lib/utils';
import { PropertyDock } from '../components/PropertyDock';
import { GuestForm } from '../components/GuestForm';
import { TemplateSelector } from '../components/TemplateSelector';
import { PreviewPhone } from '../components/PreviewPhone';
import { useApp } from '../components/providers/AppProvider';
import { TabControl } from '../components/TabControl';
import { useRouter } from 'next/navigation';

export default function GreeterPage() {
    const { properties, templates, showToast, user } = useApp();
    const router = useRouter();
    const [selectedPropId, setSelectedPropId] = useState('');
    const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
    const [guestDetails, setGuestDetails] = useState<GuestDetails>({
        guestName: '',
        numberOfGuests: 2,
        advancePaid: 0,
        checkInDate: '',
        checkOutDate: ''
    });
    const [selectedTempId, setSelectedTempId] = useState('');
    const [copied, setCopied] = useState(false);

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

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
    const selectedTemplate = templates.find(t => t.id === selectedTempId) || templates[0];

    const generatedMessage = useMemo(() => {
        if (!selectedProperty || !selectedTemplate) return '';
        const nights = calculateNights(guestDetails.checkInDate, guestDetails.checkOutDate);
        const totalBaseCost = selectedProperty.basePrice * nights;
        const extraGuestsCount = Math.max(0, guestDetails.numberOfGuests - selectedProperty.baseGuests);
        const totalExtraCost = selectedProperty.extraGuestPrice * extraGuestsCount * nights;
        const totalAmount = totalBaseCost + totalExtraCost;
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

    if (!user) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedMessage);
        setCopied(true);
        showToast('Message copied to clipboard', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(generatedMessage)}`, '_blank');
    };

    return (
        <div className="animate-fade-in pb-10 flex flex-col gap-6 md:gap-10 h-full relative">
            <div className="hidden lg:block mt-8">
                <PropertyDock properties={properties} selectedId={selectedPropId} onSelect={setSelectedPropId} />
            </div>

            {/* Mobile Header Controls (moved from Header component) */}
            <div className="lg:hidden w-[calc(100%+2rem)] -mx-4 pb-3 sticky top-[72px] z-40 bg-[#0f172a]/95 backdrop-blur-xl -mt-4 pt-4 px-4 border-b border-white/5">
                <div className="flex justify-center mb-4">
                    <TabControl
                        options={[{ id: 'edit', label: 'Editor', icon: <PenTool size={12} /> }, { id: 'preview', label: 'Preview', icon: <Eye size={12} /> }]}
                        activeId={mobileTab}
                        onChange={setMobileTab}
                        className="text-xs"
                    />
                </div>
                <PropertyDock properties={properties} selectedId={selectedPropId} onSelect={setSelectedPropId} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Section: Form and Templates */}
                <div className={`lg:col-span-8 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
                        <div className="space-y-6 md:space-y-8">
                            <GuestForm
                                details={guestDetails}
                                onChange={setGuestDetails}
                                templateContent={selectedTemplate?.content}
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
            </div>

            <div className="lg:hidden fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                <button onClick={handleCopy} className="w-12 h-12 bg-slate-700/90 backdrop-blur-md text-white rounded-full shadow-lg border border-white/10 flex items-center justify-center active:scale-90 transition-all">
                    {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                </button>
                <button onClick={handleWhatsApp} className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-xl shadow-green-500/30 flex items-center justify-center active:scale-90 transition-all hover:scale-105">
                    <MessageCircle size={28} fill="white" />
                </button>
            </div>
        </div>
    );
}
