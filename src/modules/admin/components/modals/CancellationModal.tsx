'use client';

import { useState } from 'react';
import { AlertTriangle, X, Settings, Trash2 } from 'lucide-react';

interface CancellationModalProps {
    bookingId: string | null;
    cancellationOptions: string[];
    isAdmin: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => Promise<void>;
    onAddReason: (reason: string) => void;
    onDeleteReason: (index: number) => void;
}

export function CancellationModal({
                                      bookingId,
                                      cancellationOptions,
                                      isAdmin,
                                      onClose,
                                      onConfirm,
                                      onAddReason,
                                      onDeleteReason,
                                  }: CancellationModalProps) {
    const [selectedReason, setSelectedReason] = useState<string>(cancellationOptions[0] || '');
    const [otherReasonText, setOtherReasonText] = useState<string>('');
    const [isManagingReasons, setIsManagingReasons] = useState(false);
    const [newReasonInput, setNewReasonInput] = useState('');

    if (!bookingId) return null;

    const handleConfirm = () => {
        const finalReason = selectedReason === 'Other' ? otherReasonText : selectedReason;
        if (!finalReason.trim()) {
            alert('Please specify a reason for cancellation.');
            return;
        }
        onConfirm(finalReason);
    };

    const handleAdd = () => {
        if (!newReasonInput.trim()) return;
        onAddReason(newReasonInput.trim());
        setNewReasonInput('');
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#1c120c]/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-3xl max-w-lg w-full space-y-5 shadow-2xl relative border border-[#e6c898]/40 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2 text-rose-700">
                        <AlertTriangle className="w-5 h-5" />
                        <h3 className="text-lg font-bold text-[#1c120c]">Cancel Reservation</h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
                        <X className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                <p className="text-xs text-[#2b1d14]/70">Please select or specify the reason for cancelling this reservation:</p>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {cancellationOptions.map((reason) => (
                        <label key={reason} className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition ${selectedReason === reason ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-[#faf7f2] border-transparent text-[#1c120c]'}`}>
                            <input type="radio" name="cancelReason" value={reason} checked={selectedReason === reason} onChange={() => setSelectedReason(reason)} className="accent-rose-600 cursor-pointer" />
                            <span>{reason}</span>
                        </label>
                    ))}

                    <label className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition ${selectedReason === 'Other' ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-[#faf7f2] border-transparent text-[#1c120c]'}`}>
                        <input type="radio" name="cancelReason" value="Other" checked={selectedReason === 'Other'} onChange={() => setSelectedReason('Other')} className="accent-rose-600 cursor-pointer" />
                        <span>Other (Enter Custom Reason)</span>
                    </label>
                </div>

                {selectedReason === 'Other' && (
                    <div className="space-y-1.5 animate-in fade-in duration-200">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-rose-700">Specify Other Reason</label>
                        <textarea rows={2} required placeholder="e.g., Guest requested date change, double booking..." value={otherReasonText} onChange={(e) => setOtherReasonText(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] bg-[#faf7f2] p-3 rounded-xl border border-rose-200 outline-none resize-none" />
                    </div>
                )}

                {isAdmin && (
                    <div className="pt-2 border-t border-gray-100">
                        <button type="button" onClick={() => setIsManagingReasons(!isManagingReasons)} className="text-[11px] font-bold text-[#c89349] hover:underline flex items-center gap-1 cursor-pointer">
                            <Settings className="w-3.5 h-3.5" />
                            <span>{isManagingReasons ? 'Hide Reason Options Editor' : 'Manage Cancellation Options (Add/Delete)'}</span>
                        </button>

                        {isManagingReasons && (
                            <div className="mt-3 p-3 bg-[#faf7f2] rounded-2xl border border-[#e6c898]/40 space-y-3 animate-in fade-in duration-200">
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Add new cancellation reason..." value={newReasonInput} onChange={(e) => setNewReasonInput(e.target.value)} className="w-full text-xs bg-white p-2 rounded-xl border outline-none font-medium" />
                                    <button type="button" onClick={handleAdd} className="px-3 bg-[#1c120c] text-white text-xs font-bold rounded-xl hover:bg-[#2b1d14] cursor-pointer">Add</button>
                                </div>

                                <div className="space-y-1.5">
                                    {cancellationOptions.map((opt, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg text-xs font-medium border">
                                            <span className="truncate pr-2">{opt}</span>
                                            <button type="button" onClick={() => onDeleteReason(idx)} className="text-rose-600 hover:text-rose-800 cursor-pointer p-0.5" title="Delete Reason">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="w-1/2 h-11 bg-white text-[#1c120c] border border-gray-200 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-gray-50 transition cursor-pointer">Back</button>
                    <button type="button" onClick={handleConfirm} className="w-1/2 h-11 bg-rose-700 text-white font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-rose-800 transition cursor-pointer shadow-md">
                        <X className="w-4 h-4" />
                        <span>Confirm Cancel</span>
                    </button>
                </div>
            </div>
        </div>
    );
}