'use client';

import Image from 'next/image';
import { X } from 'lucide-react';

interface ReceiptModalProps {
    receiptUrl: string | null;
    onClose: () => void;
}

export function ReceiptModal({ receiptUrl, onClose }: ReceiptModalProps) {
    if (!receiptUrl) return null;

    return (
        <div className="fixed inset-0 z-50 bg-[#1c120c]/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white p-5 rounded-3xl max-w-md w-full space-y-4 shadow-2xl relative">
                <div className="flex justify-between items-center border-b border-[#e6c898]/40 pb-3">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Payment Verification</span>
                        <h4 className="text-sm font-bold text-[#1c120c]">Uploaded Payment Screenshot</h4>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-full bg-[#faf7f2] hover:bg-[#e6c898]/30 transition text-[#1c120c] cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden bg-[#faf7f2] border border-[#e6c898]/40">
                    <Image src={receiptUrl} alt="Payment Receipt Screenshot" fill className="object-contain" />
                </div>

                <button onClick={onClose} className="w-full py-3 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#2b1d14] transition cursor-pointer">
                    Close Receipt
                </button>
            </div>
        </div>
    );
}