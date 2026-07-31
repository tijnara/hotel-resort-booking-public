'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Loader2, Save, Upload, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/modules/shared/lib/supabase/client';
import { updateRoomAction } from '../../actions/roomActions';
import type { Room } from '@/modules/shared/types/database.types';

interface EditRoomModalProps {
    room: Room;
    isOpen: boolean;
    onClose: () => void;
}

export function EditRoomModal({ room, isOpen, onClose }: EditRoomModalProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [name, setName] = useState(room.name);
    const [tagline, setTagline] = useState(room.tagline || '');
    const [description, setDescription] = useState(room.description);
    const [pricePerNight, setPricePerNight] = useState(room.price_per_night);
    const [maxGuests, setMaxGuests] = useState(room.max_guests);
    const [bedType, setBedType] = useState(room.bed_type);
    const [sizeSqm, setSizeSqm] = useState(room.size_sqm);

    // Manage image array directly for previews & deletion
    const [images, setImages] = useState<string[]>(room.images || []);
    const [manualUrl, setManualUrl] = useState('');

    if (!isOpen) return null;

    // Handle uploading photos directly to Supabase Storage
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setErrorMsg('');
        const supabase = createClient();
        const uploadedUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
            const filePath = `villas/${fileName}`;

            // Upload file to Supabase 'room-images' bucket
            const { error: uploadError } = await supabase.storage
                .from('room-images')
                .upload(filePath, file);

            if (uploadError) {
                setErrorMsg(`Upload failed: ${uploadError.message}`);
                setUploading(false);
                return;
            }

            // Get public URL
            const { data } = supabase.storage
                .from('room-images')
                .getPublicUrl(filePath);

            if (data?.publicUrl) {
                uploadedUrls.push(data.publicUrl);
            }
        }

        setImages((prev) => [...prev, ...uploadedUrls]);
        setUploading(false);
        e.target.value = ''; // Reset input
    };

    // Add manual URL input
    const handleAddManualUrl = () => {
        if (!manualUrl.trim()) return;
        setImages((prev) => [...prev, manualUrl.trim()]);
        setManualUrl('');
    };

    // Remove image from preview list
    const handleRemoveImage = (indexToRemove: number) => {
        setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        if (images.length === 0) {
            setErrorMsg('Please upload or provide at least one photo for the villa.');
            setLoading(false);
            return;
        }

        const res = await updateRoomAction(room.id, {
            name,
            tagline,
            description,
            price_per_night: Number(pricePerNight),
            max_guests: Number(maxGuests),
            bed_type: bedType,
            size_sqm: Number(sizeSqm),
            images,
        });

        setLoading(false);

        if (res.success) {
            onClose();
        } else {
            setErrorMsg(res.message || 'Failed to update room details.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#1c120c]/70 backdrop-blur-xs flex justify-center items-center p-4">
            <div className="bg-[#faf7f2] w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-[#e6c898]/40 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">

                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-[#e6c898]/40 pb-4">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Management</span>
                        <h3 className="text-xl font-bold text-[#1c120c]">Edit {room.name}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[#e6c898]/30 text-[#1c120c]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {errorMsg && (
                    <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Villa Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full text-xs font-semibold text-[#1c120c] outline-none"
                            />
                        </div>

                        <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Tagline</label>
                            <input
                                type="text"
                                value={tagline}
                                onChange={(e) => setTagline(e.target.value)}
                                placeholder="e.g. Panoramic Ocean Views"
                                className="w-full text-xs font-semibold text-[#1c120c] outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Description</label>
                        <textarea
                            required
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full text-xs font-medium text-[#1c120c] outline-none resize-none leading-relaxed"
                        />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Price / Night (₱)</label>
                            <input
                                type="number"
                                required
                                min={0}
                                value={pricePerNight}
                                onChange={(e) => setPricePerNight(Number(e.target.value))}
                                className="w-full text-xs font-bold text-[#1c120c] outline-none"
                            />
                        </div>

                        <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Max Guests</label>
                            <input
                                type="number"
                                required
                                min={1}
                                value={maxGuests}
                                onChange={(e) => setMaxGuests(Number(e.target.value))}
                                className="w-full text-xs font-bold text-[#1c120c] outline-none"
                            />
                        </div>

                        <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Bed Type</label>
                            <input
                                type="text"
                                required
                                value={bedType}
                                onChange={(e) => setBedType(e.target.value)}
                                className="w-full text-xs font-bold text-[#1c120c] outline-none"
                            />
                        </div>

                        <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Size (m²)</label>
                            <input
                                type="number"
                                required
                                min={1}
                                value={sizeSqm}
                                onChange={(e) => setSizeSqm(Number(e.target.value))}
                                className="w-full text-xs font-bold text-[#1c120c] outline-none"
                            />
                        </div>
                    </div>

                    {/* Photo Management Section */}
                    <div className="bg-white p-4 rounded-2xl border border-[#e6c898]/40 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2b1d14]/60">Gallery</span>
                                <h4 className="text-xs font-bold text-[#1c120c]">Villa Photos & Images ({images.length})</h4>
                            </div>

                            {/* Upload Button */}
                            <label className="cursor-pointer min-h-[40px] px-4 bg-[#c89349] text-[#1c120c] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 hover:bg-[#b07d37] transition active:scale-95">
                                {uploading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        <span>Upload Photos</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Thumbnail Preview Grid */}
                        {images.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                                {images.map((url, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-[#faf7f2] border border-[#e6c898]/40 group">
                                        <Image
                                            src={url}
                                            alt={`Villa photo ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(idx)}
                                            className="absolute top-1.5 right-1.5 w-7 h-7 bg-rose-600 text-white rounded-full flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition shadow-md"
                                            title="Remove image"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center border-2 border-dashed border-[#e6c898]/40 rounded-xl text-xs text-[#2b1d14]/50 space-y-1">
                                <ImageIcon className="w-8 h-8 mx-auto text-[#c89349]" />
                                <p>No photos uploaded yet.</p>
                            </div>
                        )}

                        {/* Manual URL Input Fallback */}
                        <div className="pt-2 border-t border-[#faf7f2] flex items-center gap-2">
                            <input
                                type="url"
                                placeholder="Or paste an image URL directly..."
                                value={manualUrl}
                                onChange={(e) => setManualUrl(e.target.value)}
                                className="w-full text-xs font-semibold text-[#1c120c] bg-[#faf7f2] p-2.5 rounded-xl border border-[#e6c898]/40 outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleAddManualUrl}
                                className="min-h-[38px] px-4 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase rounded-xl flex items-center gap-1 hover:bg-[#2b1d14] transition"
                            >
                                <Plus className="w-4 h-4 text-[#c89349]" />
                                <span>Add</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-1/2 h-12 bg-white text-[#1c120c] border border-[#e6c898]/40 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="w-1/2 h-12 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                    <Save className="w-4 h-4 text-[#c89349]" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}