"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Check, Copy, MessageCircle, PenTool, Eye } from 'lucide-react';
import { GuestDetails } from '../lib/types';
import { DEFAULT_GUEST_DETAILS } from '../lib/constants';
import { calculateNights, formatDate, formatCurrency, processTemplate } from '../lib/utils';
import { PropertyDock } from '../components/PropertyDock';
import { GuestForm } from '../components/GuestForm';
import { TemplateSelector } from '../components/TemplateSelector';
import { PreviewPhone } from '../components/PreviewPhone';
import { useApp } from '../components/providers/AppProvider';
import { useRouter } from 'next/navigation';

export default function GreeterPage() {
    const { properties, templates, showToast, user } = useApp();
    const router = useRouter();
    const [selectedPropId, setSelectedPropId] = useState('');
    const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
    const [guestDetails, setGuestDetails] = useState<GuestDetails>(DEFAULT_GUEST_DETAILS);
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
        if (!generatedMessage) return;
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(generatedMessage)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="animate-fade-in pb-24 md:pb-0 flex flex-col gap-6 md:gap-10 h-full relative">
            <div className="hidden lg:block mt-8">
                <PropertyDock properties={properties} selectedId={selectedPropId} onSelect={setSelectedPropId} />
            </div>

            {/* Mobile Header Controls - REMOVED TabControl, kept PropertyDock but simplified */}
            <div className="lg:hidden w-[calc(100%+2rem)] -mx-4 sticky top-[72px] z-40 bg-[#0f172a]/95 backdrop-blur-xl -mt-4 py-3 px-4 border-b border-white/5">
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
                        className="flex flex-col items-center justify-center rounded-xl bg-[#25D366] text-white shadow-lg active:scale-95 transition-all"
                    >
                        <MessageCircle size={24} fill="white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
