'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Users, Maximize2, Sparkles } from 'lucide-react';
import { CheckoutDrawer } from '@/modules/bookings/components/CheckoutDrawer';
import type { Room } from '@/modules/shared/types/database.types';

interface RoomCarouselProps {
    rooms: Room[];
}

export function RoomCarousel({ rooms }: RoomCarouselProps) {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    if (rooms.length === 0) {
        return (
            <div className="bg-white rounded-3xl border border-[#e6c898]/40 p-12 text-center max-w-lg mx-auto space-y-3 shadow-sm">
                <div className="w-12 h-12 bg-amber-100 text-[#c89349] rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#1c120c]">No Villas Available</h3>
                <p className="text-xs text-[#2b1d14]/70 leading-relaxed">
                    All our Executive Kubo Villas are fully reserved for these selected dates. Please try adjusting your check-in or check-out dates above.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="
        flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 -mx-5 px-5
        [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
        md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:p-0 md:m-0
      ">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className="
              snap-center shrink-0 w-[88%] sm:w-[65%] md:w-auto
              bg-white rounded-2xl border border-[#e6c898]/40 overflow-hidden shadow-xs
              flex flex-col justify-between group hover:shadow-xl transition duration-300
            "
                    >
                        <div>
                            <div className="relative aspect-4/3 w-full overflow-hidden bg-[#faf7f2]">
                                {room.images?.[0] && (
                                    <Image
                                        src={room.images[0]}
                                        alt={room.name}
                                        fill
                                        sizes="(max-width: 768px) 88vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition duration-500"
                                    />
                                )}
                                <div className="absolute top-3 right-3 bg-[#1c120c]/85 backdrop-blur-md text-[#faf7f2] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-[#c89349]/30">
                                    {room.bed_type}
                                </div>
                            </div>

                            <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] block mb-1">
                  {room.tagline || 'Coastal Kubo'}
                </span>
                                <h3 className="font-bold text-lg text-[#1c120c] tracking-tight">{room.name}</h3>
                                <p className="text-[#2b1d14]/70 text-xs mt-2 line-clamp-2 leading-relaxed">
                                    {room.description}
                                </p>

                                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#faf7f2] text-[#2b1d14]/70 text-xs font-medium">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#c89349]" />
                    Max {room.max_guests} Guests
                  </span>
                                    <span className="flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-[#c89349]" />
                                        {room.size_sqm} m²
                  </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 pt-0 flex items-center justify-between border-t border-[#faf7f2] mt-2">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2b1d14]/50 block">Nightly</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="font-black text-xl text-[#1c120c]">₱{Number(room.price_per_night).toLocaleString()}</span>
                                    <span className="text-[#2b1d14]/50 text-xs">/night</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedRoom(room)}
                                className="min-h-[44px] px-5 flex items-center justify-center bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#2b1d14] active:scale-95 transition cursor-pointer"
                            >
                                Reserve
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedRoom && (
                <CheckoutDrawer
                    room={selectedRoom}
                    isOpen={!!selectedRoom}
                    onClose={() => setSelectedRoom(null)}
                />
            )}
        </>
    );
}