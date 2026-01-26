import React from 'react';
import { Smartphone, Check, Copy, MessageCircle } from 'lucide-react';
import { Button } from './ui/Button';

export const PreviewPhone: React.FC<{
    message: string;
    onSend: () => void;
    onCopy: () => void;
    copied: boolean;
}> = ({ message, onSend, onCopy, copied }) => (
    <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-[#000] ring-4 ring-slate-800">
        <div className="bg-[#1f2937] p-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xs">
                    <Smartphone size={16} />
                </div>
                <div>
                    <div className="text-xs font-bold text-white">Guest</div>
                    <div className="text-[10px] text-green-400">Online</div>
                </div>
            </div>
            <button onClick={onCopy} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
            </button>
        </div>

        <div className="relative bg-[#0b141a] min-h-[350px] lg:min-h-[400px] p-3 bg-[url('https://i.pinimg.com/originals/97/c0/07/97c00759d90d786d9b6096d274ad3e07.png')] bg-opacity-10 bg-contain">
            <div className="bg-[#202c33] p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl text-slate-100 text-xs leading-relaxed shadow-sm max-w-[95%] relative border border-white/5 animate-fade-in">
                <div className="whitespace-pre-wrap break-words">{message}</div>
                <div className="text-[9px] text-slate-500 text-right mt-1.5 flex items-center justify-end gap-1">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <Check size={12} className="text-blue-400" />
                </div>
            </div>
        </div>

        {/* Desktop Action Bar */}
        <div className="p-4 bg-[#1f2937] border-t border-white/5 hidden lg:block">
            <Button onClick={onSend} className="w-full bg-[#25D366] hover:bg-[#128C7E] shadow-green-900/20 text-white border-none py-4 text-lg rounded-2xl">
                <MessageCircle size={20} fill="white" className="text-white" /> Send via WhatsApp
            </Button>
        </div>
    </div>
);
