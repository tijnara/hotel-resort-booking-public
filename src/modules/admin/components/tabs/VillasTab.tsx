'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, Save, Edit3, Trash2, Eye, EyeOff } from 'lucide-react';
import { HeroBackgroundControl } from '../settings/HeroBackgroundControl';
import { updateRoomAction } from '../../actions/roomActions';
import type { Room } from '@/modules/shared/types/database.types';
import type { SiteSettings } from '@/modules/settings/services/getSettings';

const DEFAULT_VILLAS_BANNER = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80';

interface VillasTabProps {
    initialRooms: Room[];
    siteSettings?: SiteSettings;
    isAdmin: boolean;
    deletingRoomId: string | null;
    onOpenRoomModal: (room: Room | null) => void;
    onDeleteRoom: (id: string, name: string) => void;
    onSaveHeader: (payload: { title: string; description: string; bgType: 'image' | 'color'; bgColor: string; bgImage: string }) => Promise<{ success: boolean; message?: string }>;
}

export function VillasTab({
                              initialRooms,
                              siteSettings,
                              isAdmin,
                              deletingRoomId,
                              onOpenRoomModal,
                              onDeleteRoom,
                              onSaveHeader,
                          }: VillasTabProps) {
    const router = useRouter();
    const [togglingRoomId, setTogglingRoomId] = useState<string | null>(null);

    const [villasTitle, setVillasTitle] = useState(siteSettings?.villas_title || 'Handcrafted Kubo Villas');
    const [villasDescription, setVillasDescription] = useState(siteSettings?.villas_description || '');
    const [villasHeroBgType, setVillasHeroBgType] = useState<'image' | 'color'>(siteSettings?.villas_hero_bg_type || 'image');
    const [villasHeroBgColor, setVillasHeroBgColor] = useState(siteSettings?.villas_hero_bg_color || '#1c120c');
    const [villasHeroImage, setVillasHeroImage] = useState(siteSettings?.villas_hero_image || '');

    const [savingHeader, setSavingHeader] = useState(false);
    const [headerMsg, setHeaderMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // 1-Click Quick Visibility Toggle Action
    const handleToggleVisibility = async (room: Room) => {
        if (!isAdmin) return;
        setTogglingRoomId(room.id);
        const res = await updateRoomAction(room.id, {
            ...room,
            is_hidden: !room.is_hidden,
        });
        setTogglingRoomId(null);

        if (res.success) {
            router.refresh();
        } else {
            alert(res.message || 'Failed to toggle room visibility.');
        }
    };

    const handleHeaderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin) return;
        setSavingHeader(true);
        setHeaderMsg(null);

        const res = await onSaveHeader({
            title: villasTitle,
            description: villasDescription,
            bgType: villasHeroBgType,
            bgColor: villasHeroBgColor,
            bgImage: villasHeroImage,
        });

        setSavingHeader(false);
        if (res.success) {
            setHeaderMsg({ type: 'success', text: 'Kubo Villas page header and hero background updated successfully!' });
        } else {
            setHeaderMsg({ type: 'error', text: res.message || 'Failed to update page header.' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Inventory</span>
                    <h3 className="text-lg font-bold text-[#1c120c]">Kubo Villa Accommodations</h3>
                    <p className="text-xs text-[#2b1d14]/60">Manage pricing, photos, guest capacity, and room details.</p>
                </div>

                {isAdmin && (
                    <button
                        onClick={() => onOpenRoomModal(null)}
                        className="min-h-[44px] px-6 bg-[#c89349] text-[#1c120c] font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2 hover:bg-[#b07d37] transition cursor-pointer shadow-md active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Villa</span>
                    </button>
                )}
            </div>

            {isAdmin && (
                <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-4">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Villas Page Content</span>
                        <h3 className="text-lg font-bold text-[#1c120c]">Main Heading Title, Description & Hero Background</h3>
                    </div>

                    {headerMsg && (
                        <div className={`p-3 text-xs rounded-xl font-bold ${
                            headerMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                            {headerMsg.text}
                        </div>
                    )}

                    <form onSubmit={handleHeaderSubmit} className="space-y-4">
                        <HeroBackgroundControl
                            title="Cabins / Kubo Villas Hero Background"
                            bgType={villasHeroBgType}
                            imageUrl={villasHeroImage}
                            bgColor={villasHeroBgColor}
                            defaultImageUrl={DEFAULT_VILLAS_BANNER}
                            onTypeChange={(type) => setVillasHeroBgType(type)}
                            onImageChange={(url) => setVillasHeroImage(url)}
                            onColorChange={(color) => setVillasHeroBgColor(color)}
                        />

                        <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Main Heading Title</label>
                            <input
                                type="text"
                                required
                                value={villasTitle}
                                onChange={(e) => setVillasTitle(e.target.value)}
                                className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                            />
                        </div>

                        <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Description Paragraph</label>
                            <textarea
                                rows={2}
                                required
                                value={villasDescription}
                                onChange={(e) => setVillasDescription(e.target.value)}
                                className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={savingHeader}
                            className="min-h-[42px] px-6 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition cursor-pointer"
                        >
                            {savingHeader ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                    <Save className="w-4 h-4 text-[#c89349]" />
                                    <span>Save Header Content</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialRooms.map((room) => (
                    <div
                        key={room.id}
                        className={`bg-white rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between transition-all border ${
                            room.is_hidden
                                ? 'border-rose-300/80 bg-rose-50/20'
                                : 'border-[#e6c898]/40'
                        }`}
                    >
                        <div>
                            <div className="relative aspect-16/9 w-full bg-[#faf7f2]">
                                {room.images?.[0] && (
                                    <Image
                                        src={room.images[0]}
                                        alt={room.name}
                                        fill
                                        className={`object-cover ${room.is_hidden ? 'opacity-60 grayscale-[30%]' : ''}`}
                                    />
                                )}

                                {room.is_hidden && (
                                    <div className="absolute top-3 left-3 bg-rose-950/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-rose-400/40 flex items-center gap-1 shadow-md">
                                        <EyeOff className="w-3 h-3 text-rose-300" />
                                        <span>Hidden / Maintenance</span>
                                    </div>
                                )}

                                <div className="absolute top-3 right-3 bg-[#1c120c]/85 backdrop-blur-md text-[#faf7f2] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#c89349]/30">
                                    {room.bed_type}
                                </div>
                            </div>
                            <div className="p-5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] block mb-1">
                                    {room.tagline || 'Kubo Villa'}
                                </span>
                                <h3 className="font-bold text-lg text-[#1c120c]">{room.name}</h3>
                                <p className="text-xs text-[#2b1d14]/70 mt-2 line-clamp-2 leading-relaxed">{room.description}</p>
                            </div>
                        </div>

                        <div className="p-5 pt-0 border-t border-[#faf7f2] mt-2 flex items-center justify-between">
                            <span className="font-extrabold text-xl text-[#1c120c]">₱{Number(room.price_per_night).toLocaleString()}</span>
                            {isAdmin && (
                                <div className="flex items-center gap-1.5">
                                    {/* 👁️ Toggle Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleToggleVisibility(room)}
                                        disabled={togglingRoomId === room.id}
                                        title={room.is_hidden ? 'Click to show on public website' : 'Click to hide for maintenance'}
                                        className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center gap-1 cursor-pointer transition active:scale-95 ${
                                            room.is_hidden
                                                ? 'bg-rose-100 text-rose-900 border-rose-300 hover:bg-rose-200'
                                                : 'bg-[#faf7f2] text-[#2b1d14]/70 border-[#e6c898]/40 hover:bg-gray-100 hover:text-[#1c120c]'
                                        }`}
                                    >
                                        {togglingRoomId === room.id ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c89349]" />
                                        ) : room.is_hidden ? (
                                            <>
                                                <EyeOff className="w-3.5 h-3.5 text-rose-700" />
                                                <span>Hidden</span>
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="w-3.5 h-3.5 text-[#c89349]" />
                                                <span>Visible</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Edit Button */}
                                    <button
                                        onClick={() => onOpenRoomModal(room)}
                                        className="px-3 py-2 bg-[#1c120c] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 hover:bg-[#2b1d14]"
                                    >
                                        <Edit3 className="w-3.5 h-3.5 text-[#c89349]" />
                                        <span>Edit</span>
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => onDeleteRoom(room.id, room.name)}
                                        disabled={deletingRoomId === room.id}
                                        className="px-2.5 py-2 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-100 cursor-pointer active:scale-95"
                                    >
                                        {deletingRoomId === room.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}