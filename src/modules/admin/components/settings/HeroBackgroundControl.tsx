'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, Loader2, Image as ImageIcon, Palette, Trash2 } from 'lucide-react';
import { createClient } from '@/modules/shared/lib/supabase/client';

interface HeroBackgroundControlProps {
    title: string;
    bgType?: 'image' | 'color';
    imageUrl?: string;
    bgColor?: string;
    defaultImageUrl: string;
    onTypeChange: (type: 'image' | 'color') => void;
    onImageChange: (url: string) => void;
    onColorChange: (color: string) => void;
}

const PRESET_COLORS = [
    { label: 'Resort Obsidian', value: '#1c120c' },
    { label: 'Deep Coastal Brown', value: '#2b1d14' },
    { label: 'Warm Bamboo', value: '#3a271b' },
    { label: 'Midnight Blue', value: '#0f172a' },
    { label: 'Emerald Forest', value: '#064e3b' },
];

export function HeroBackgroundControl({
                                          title,
                                          bgType = 'image',
                                          imageUrl,
                                          bgColor = '#1c120c',
                                          defaultImageUrl,
                                          onTypeChange,
                                          onImageChange,
                                          onColorChange,
                                      }: HeroBackgroundControlProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const supabase = createClient();
        const filePath = `hero-banners/hero-${Date.now()}.${file.name.split('.').pop()}`;

        const { error } = await supabase.storage.from('room-images').upload(filePath, file);

        if (!error) {
            const { data } = supabase.storage.from('room-images').getPublicUrl(filePath);
            if (data?.publicUrl) onImageChange(data.publicUrl);
        }
        setUploading(false);
    };

    return (
        <div className="bg-[#faf7f2] p-5 rounded-2xl border border-[#e6c898]/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <span className="text-[10px] font-bold text-[#c89349] uppercase tracking-widest block">{title}</span>
                    <p className="text-[11px] text-gray-500">Select either a background photo or a solid background color.</p>
                </div>

                {/* Mode Selector Toggle */}
                <div className="inline-flex bg-white p-1 rounded-xl border border-[#e6c898]/40 text-xs font-bold self-start">
                    <button
                        type="button"
                        onClick={() => onTypeChange('image')}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                            bgType === 'image' ? 'bg-[#1c120c] text-[#c89349]' : 'text-gray-600 hover:text-black'
                        }`}
                    >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Photo</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => onTypeChange('color')}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                            bgType === 'color' ? 'bg-[#1c120c] text-[#c89349]' : 'text-gray-600 hover:text-black'
                        }`}
                    >
                        <Palette className="w-3.5 h-3.5" />
                        <span>Color</span>
                    </button>
                </div>
            </div>

            {/* Mode 1: Photo Options */}
            {bgType === 'image' && (
                <div className="space-y-3 pt-2">
                    <div className="relative w-full h-36 bg-black/80 rounded-xl overflow-hidden border border-[#e6c898]/40">
                        <Image
                            src={imageUrl || defaultImageUrl}
                            alt="Hero Background Preview"
                            fill
                            className="object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex items-end p-3">
                            <span className="text-[10px] text-white/90 font-mono bg-black/60 px-2 py-1 rounded-md">
                                {imageUrl ? 'Custom Uploaded Image' : 'Default Page Banner Photo'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <label className="cursor-pointer min-h-[38px] px-4 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase rounded-xl flex items-center gap-2 hover:bg-[#2b1d14] transition">
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-[#c89349]" />}
                            <span>{imageUrl ? 'Replace Image' : 'Upload Custom Image'}</span>
                            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
                        </label>

                        {imageUrl && (
                            <button
                                type="button"
                                onClick={() => onImageChange('')}
                                className="min-h-[38px] px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Reset Photo</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Mode 2: Color Options */}
            {bgType === 'color' && (
                <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-xl border border-[#c89349]/50 shadow-inner shrink-0"
                            style={{ backgroundColor: bgColor || '#1c120c' }}
                        />
                        <div className="flex-grow space-y-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Color Hex Code</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={bgColor || '#1c120c'}
                                    onChange={(e) => onColorChange(e.target.value)}
                                    className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                                />
                                <input
                                    type="text"
                                    placeholder="#1c120c"
                                    value={bgColor || ''}
                                    onChange={(e) => onColorChange(e.target.value)}
                                    className="w-full text-xs font-mono font-semibold text-[#1c120c] bg-white p-2.5 rounded-xl border border-[#e6c898]/40 outline-none focus:border-[#c89349]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Preset Theme Colors</span>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => onColorChange(color.value)}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-lg border border-[#e6c898]/40 text-[11px] font-medium text-gray-700 hover:border-[#c89349] transition cursor-pointer"
                                >
                                    <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: color.value }} />
                                    <span>{color.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}