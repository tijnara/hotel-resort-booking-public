'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Compass, Heart, ShieldCheck, ArrowRight, Sun, Waves, Leaf, Wind, Home, Droplets } from 'lucide-react';
import { BrandIcon } from '@/modules/shared/components/BrandIcon';
import { Header } from '@/modules/shared/components/Header';
import { Footer } from '@/modules/shared/components/Footer';
import type { SiteSettings } from '@/modules/settings/services/getSettings';

export function AboutClient({ settings }: { settings: SiteSettings }) {
    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-[#c89349]" />;
            case 'Palmtree': return <BrandIcon iconName="Palmtree" className="w-6 h-6 text-[#c89349]" />;
            case 'Heart': return <Heart className="w-6 h-6 text-[#c89349]" />;
            case 'Compass': return <Compass className="w-6 h-6 text-[#c89349]" />;
            case 'Sun': return <Sun className="w-6 h-6 text-[#c89349]" />;
            case 'Waves': return <Waves className="w-6 h-6 text-[#c89349]" />;
            case 'Leaf': return <Leaf className="w-6 h-6 text-[#c89349]" />;
            case 'Wind': return <Wind className="w-6 h-6 text-[#c89349]" />;
            case 'Droplets': return <Droplets className="w-6 h-6 text-[#c89349]" />;
            case 'Home': return <Home className="w-6 h-6 text-[#c89349]" />;
            default: return <BrandIcon iconName={iconName} className="w-6 h-6 text-[#c89349]" />;
        }
    };

    const features = (settings.about_features && settings.about_features.length > 0)
        ? settings.about_features
        : [
            {
                icon: 'ShieldCheck',
                title: 'Eco-Conscious Architecture',
                description: 'Built with sustainably sourced local timber and traditional bamboo weaving for natural coastal ventilation.',
            },
            {
                icon: 'Palmtree',
                title: 'Private Oceanfront Access',
                description: 'Enjoy peaceful beachfront views far from crowded commercial tourist strips.',
            },
            {
                icon: 'Heart',
                title: 'Warm Filipino Hospitality',
                description: 'Our front desk and resort staff provide personalized service to make every stay feel like home.',
            },
        ];

    return (
        <div className="min-h-screen bg-[#faf7f2] text-[#1c120c] flex flex-col justify-between">
            <div>
                {/* Shared Header Component */}
                <Header settings={settings} />

                {/* Hero Section */}
                <section className="relative bg-[#1c120c] text-[#faf7f2] pt-20 pb-20 px-6 text-center">
                    <div className="max-w-5xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c89349] flex items-center justify-center gap-2">
              <BrandIcon iconName={settings.site_icon} className="w-4 h-4 text-[#c89349]" />
              <span>{settings.about_badge_text || `Discover ${settings.site_name || 'SEAVIEW'}`}</span>
            </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#faf7f2]">
                            {settings.about_title || 'Crafted for Serenity & Comfort'}
                        </h1>
                        <p className="text-sm md:text-base text-[#faf7f2]/70 max-w-2xl mx-auto leading-relaxed font-light">
                            {settings.about_subtitle || 'A beachfront staycation tucked away along the pristine coastal waters of Pangasinan.'}
                        </p>
                    </div>
                </section>

                {/* Main Story & Image Section */}
                <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#c89349]">Our Heritage</span>
                        <h2 className="text-2xl md:text-4xl font-extrabold text-[#1c120c]">
                            {settings.about_story_title || 'The Seaview Story'}
                        </h2>
                        <p className="text-sm md:text-base text-[#2b1d14]/80 leading-relaxed font-light">
                            {settings.about_story_body}
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/villas"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#2b1d14] transition cursor-pointer"
                            >
                                <span>Explore Our Villas</span>
                                <ArrowRight className="w-4 h-4 text-[#c89349]" />
                            </Link>
                        </div>
                    </div>

                    <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-[#e6c898]/40 shadow-lg">
                        <Image
                            src={settings.about_image_url || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200'}
                            alt={`${settings.site_name || 'Resort'} Grounds`}
                            fill
                            className="object-cover"
                        />
                    </div>
                </section>

                {/* Mission & Vision Cards */}
                <section className="bg-[#1c120c]/5 py-16 border-y border-[#e6c898]/30">
                    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-3">
                            <Compass className="w-8 h-8 text-[#c89349]" />
                            <h3 className="text-lg font-bold text-[#1c120c]">Our Mission</h3>
                            <p className="text-xs md:text-sm text-[#2b1d14]/75 leading-relaxed">
                                {settings.about_mission}
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-3">
                            <Heart className="w-8 h-8 text-[#c89349]" />
                            <h3 className="text-lg font-bold text-[#1c120c]">Our Vision</h3>
                            <p className="text-xs md:text-sm text-[#2b1d14]/75 leading-relaxed">
                                {settings.about_vision}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Dynamic Features Section */}
                <section className="max-w-6xl mx-auto px-6 py-16 space-y-12 text-center">
                    <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#c89349]">
              {settings.about_features_subtitle || 'WHY CHOOSE US'}
            </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1c120c] mt-1">
                            {settings.about_features_title || 'The Seaview Difference'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {features.map((feature, idx) => (
                            <div key={idx} className="p-6 bg-white rounded-2xl border border-[#e6c898]/30 space-y-2 shadow-xs">
                                {renderIcon(feature.icon)}
                                <h4 className="font-bold text-sm text-[#1c120c]">{feature.title}</h4>
                                <p className="text-xs text-[#2b1d14]/70 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Shared Footer Component */}
            <Footer settings={settings} />
        </div>
    );
}