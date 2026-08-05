'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Loader2, Save, Upload, Trash2, Plus, Image as ImageIcon, Globe, HelpCircle, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/modules/shared/lib/supabase/client';
import { updateRoomAction, createRoomAction } from '../../actions/roomActions';
import type { Room } from '@/modules/shared/types/database.types';

export interface OtaSource {
    id: string;
    name: string;
    url: string;
}

interface EditRoomModalProps {
    room: Room | null; // Pass null when creating a new villa
    isOpen: boolean;
    onClose: () => void;
}

export function EditRoomModal({ room, isOpen, onClose }: EditRoomModalProps) {
    const isEditing = !!room;

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showIcalInstructions, setShowIcalInstructions] = useState(false);

    const [name, setName] = useState(room?.name || '');
    const [tagline, setTagline] = useState(room?.tagline || '');
    const [description, setDescription] = useState(room?.description || '');
    const [pricePerNight, setPricePerNight] = useState(room?.price_per_night || 5000);
    const [maxGuests, setMaxGuests] = useState(room?.max_guests || 2);
    const [bedType, setBedType] = useState(room?.bed_type || '1 King Bed');
    const [sizeSqm, setSizeSqm] = useState(room?.size_sqm || 35);

    // Dynamic OTA Channels State
    const [icalSources, setIcalSources] = useState<OtaSource[]>(() => {
        const raw = (room as { ical_sources?: OtaSource[] })?.ical_sources;
        if (raw && raw.length > 0) return raw;

        const legacy: OtaSource[] = [];
        if ((room as { airbnb_ical_url?: string })?.airbnb_ical_url) {
            legacy.push({ id: 'airbnb_legacy', name: 'Airbnb', url: (room as { airbnb_ical_url?: string }).airbnb_ical_url! });
        }
        if ((room as { booking_ical_url?: string })?.booking_ical_url) {
            legacy.push({ id: 'booking_legacy', name: 'Booking.com', url: (room as { booking_ical_url?: string }).booking_ical_url! });
        }
        return legacy;
    });

    const [images, setImages] = useState<string[]>(room?.images || []);
    const [manualUrl, setManualUrl] = useState('');

    if (!isOpen) return null;

    // OTA Source Handlers
    const handleAddIcalSource = () => {
        setIcalSources((prev) => [
            ...prev,
            { id: `ota_${Date.now()}`, name: '', url: '' },
        ]);
    };

    const handleUpdateIcalSource = (id: string, field: 'name' | 'url', value: string) => {
        setIcalSources((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const handleRemoveIcalSource = (id: string) => {
        setIcalSources((prev) => prev.filter((item) => item.id !== id));
    };

    // Uploading photos directly to Supabase Storage
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

            const { error: uploadError } = await supabase.storage
                .from('room-images')
                .upload(filePath, file);

            if (uploadError) {
                setErrorMsg(`Upload failed: ${uploadError.message}`);
                setUploading(false);
                return;
            }

            const { data } = supabase.storage
                .from('room-images')
                .getPublicUrl(filePath);

            if (data?.publicUrl) {
                uploadedUrls.push(data.publicUrl);
            }
        }

        setImages((prev) => [...prev, ...uploadedUrls]);
        setUploading(false);
        e.target.value = '';
    };

    const handleAddManualUrl = () => {
        if (!manualUrl.trim()) return;
        setImages((prev) => [...prev, manualUrl.trim()]);
        setManualUrl('');
    };

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

        const roomPayload = {
            name,
            tagline,
            description,
            price_per_night: Number(pricePerNight),
            max_guests: Number(maxGuests),
            bed_type: bedType,
            size_sqm: Number(sizeSqm),
            images,
            ical_sources: icalSources.filter((s) => s.name.trim() !== '' || s.url.trim() !== ''),
        };

        const res = isEditing && room
            ? await updateRoomAction(room.id, roomPayload)
            : await createRoomAction(roomPayload);

        setLoading(false);

        if (res.success) {
            onClose();
        } else {
            setErrorMsg(res.message || 'Failed to save villa details.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#1c120c]/70 backdrop-blur-xs flex justify-center items-center p-4">
            <div className="bg-[#faf7f2] w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-[#e6c898]/40 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">

                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-[#e6c898]/40 pb-4">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">
                            {isEditing ? 'Management' : 'New Accommodation'}
                        </span>
                        <h3 className="text-xl font-bold text-[#1c120c]">
                            {isEditing ? `Edit ${room?.name}` : 'Add New Kubo Villa'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[#e6c898]/30 text-[#1c120c] cursor-pointer"
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
                                placeholder="e.g. Executive Kubo Suite"
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
                            placeholder="Handcrafted bamboo suite featuring panoramic oceanfront views..."
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

                    {/* Dynamic OTA Channels Management with Built-in iCal Guide */}
                    <div className="bg-white p-4 rounded-2xl border border-[#e6c898]/40 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Calendar Synchronization</span>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-bold text-[#1c120c]">Connected Booking Sites (iCal)</h4>
                                    <button
                                        type="button"
                                        onClick={() => setShowIcalInstructions(!showIcalInstructions)}
                                        className="text-[11px] font-bold text-[#c89349] hover:underline flex items-center gap-0.5 cursor-pointer"
                                    >
                                        <HelpCircle className="w-3.5 h-3.5" />
                                        <span>{showIcalInstructions ? 'Hide Guide' : 'How to get iCal link?'}</span>
                                        {showIcalInstructions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddIcalSource}
                                className="px-3 py-1.5 bg-[#c89349] text-[#1c120c] font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-[#b07d37] transition cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Booking Site</span>
                            </button>
                        </div>

                        {/* Collapsible iCal Export Guide Notes */}
                        {showIcalInstructions && (
                            <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/50 space-y-3 text-xs text-[#2b1d14] animate-in fade-in duration-200">
                                <div className="flex items-center justify-between border-b border-[#e6c898]/40 pb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">
                                        How to Extract .ics Links from OTA Portals
                                    </span>
                                    <span className="text-[10px] bg-[#c89349]/20 text-[#1c120c] px-2 py-0.5 rounded-full font-bold">
                                        Per-Room Setup
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                                    {/* 1. Airbnb */}
                                    <div className="bg-white p-3 rounded-xl border border-[#e6c898]/30 space-y-1">
                                        <h5 className="font-bold text-[#1c120c] flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                                            Airbnb
                                        </h5>
                                        <ol className="list-decimal list-inside space-y-0.5 text-gray-600">
                                            <li>Go to <strong>Listings</strong> → Select Villa.</li>
                                            <li>Click <strong>Pricing & Availability</strong>.</li>
                                            <li>Under <strong>Calendar sync</strong>, click <strong>Export calendar</strong>.</li>
                                            <li>Copy the generated <code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">.ics</code> URL.</li>
                                        </ol>
                                    </div>

                                    {/* 2. Booking.com */}
                                    <div className="bg-white p-3 rounded-xl border border-[#e6c898]/30 space-y-1">
                                        <h5 className="font-bold text-[#1c120c] flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                                            Booking.com
                                        </h5>
                                        <ol className="list-decimal list-inside space-y-0.5 text-gray-600">
                                            <li>Log in to <strong>Extranet</strong>.</li>
                                            <li>Go to <strong>Rates & Availability</strong> → <strong>Sync Calendars</strong>.</li>
                                            <li>Scroll to <strong>Export your calendar</strong>.</li>
                                            <li>Click <strong>Copy link</strong> for this room.</li>
                                        </ol>
                                    </div>

                                    {/* 3. Agoda */}
                                    <div className="bg-white p-3 rounded-xl border border-[#e6c898]/30 space-y-1">
                                        <h5 className="font-bold text-[#1c120c] flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                                            Agoda (YCS)
                                        </h5>
                                        <ol className="list-decimal list-inside space-y-0.5 text-gray-600">
                                            <li>Log in to <strong>Agoda Partner Hub / YCS</strong>.</li>
                                            <li>Go to <strong>Calendar</strong> → <strong>Calendar connections</strong>.</li>
                                            <li>Find this room unit.</li>
                                            <li>Click <strong>Copy calendar link</strong>.</li>
                                        </ol>
                                    </div>

                                    {/* 4. Vrbo & Expedia */}
                                    <div className="bg-white p-3 rounded-xl border border-[#e6c898]/30 space-y-1">
                                        <h5 className="font-bold text-[#1c120c] flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" />
                                            Vrbo / Expedia
                                        </h5>
                                        <ol className="list-decimal list-inside space-y-0.5 text-gray-600">
                                            <li>Log in to Partner Dashboard → <strong>Calendar</strong>.</li>
                                            <li>Click <strong>Import & Export</strong> → <strong>Export Calendar</strong>.</li>
                                            <li>Copy the exported URL feed.</li>
                                        </ol>
                                    </div>
                                </div>

                                <div className="p-2.5 bg-[#c89349]/10 rounded-xl text-[10px] text-[#1c120c] font-medium flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#c89349] shrink-0" />
                                    <span>
                                        <strong>Verification Tip:</strong> Paste the copied link into a browser address bar. If it displays text starting with <code className="font-mono bg-white px-1 py-0.5 rounded">BEGIN:VCALENDAR</code>, the feed is valid!
                                    </span>
                                </div>
                            </div>
                        )}

                        {icalSources.length === 0 ? (
                            <p className="text-xs text-gray-500 italic text-center py-2">
                                No external booking sites added. Click above to add Airbnb, Booking.com, Agoda, Vrbo, etc.
                            </p>
                        ) : (
                            <div className="space-y-2.5">
                                {icalSources.map((source) => (
                                    <div key={source.id} className="p-3 bg-[#faf7f2] rounded-xl border border-[#e6c898]/30 space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-1">
                                                <Globe className="w-3.5 h-3.5 text-[#c89349] shrink-0" />
                                                <input
                                                    type="text"
                                                    placeholder="Platform Name (e.g. Airbnb, Agoda, Vrbo)"
                                                    value={source.name}
                                                    onChange={(e) => handleUpdateIcalSource(source.id, 'name', e.target.value)}
                                                    className="text-xs font-bold text-[#1c120c] outline-none w-full bg-transparent border-b border-gray-300 focus:border-[#c89349] pb-0.5"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveIcalSource(source.id)}
                                                className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
                                                title="Remove Site Connection"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <input
                                            type="url"
                                            placeholder="Paste iCal Feed URL (.ics link)"
                                            value={source.url}
                                            onChange={(e) => handleUpdateIcalSource(source.id, 'url', e.target.value)}
                                            className="w-full text-xs font-mono bg-white p-2 rounded-lg border border-gray-200 outline-none text-gray-800"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Photo Management Section */}
                    <div className="bg-white p-4 rounded-2xl border border-[#e6c898]/40 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2b1d14]/60">Gallery</span>
                                <h4 className="text-xs font-bold text-[#1c120c]">Villa Photos & Images ({images.length})</h4>
                            </div>

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
                                            alt={`Villas photo ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(idx)}
                                            className="absolute top-1.5 right-1.5 w-7 h-7 bg-rose-600 text-white rounded-full flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition shadow-md cursor-pointer"
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
                                className="min-h-[38px] px-4 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase rounded-xl flex items-center gap-1 hover:bg-[#2b1d14] transition cursor-pointer shrink-0"
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
                            className="w-1/2 h-12 bg-white text-[#1c120c] border border-[#e6c898]/40 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-slate-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="w-1/2 h-12 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                    <Save className="w-4 h-4 text-[#c89349]" />
                                    <span>{isEditing ? 'Save Changes' : 'Create Villa'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}