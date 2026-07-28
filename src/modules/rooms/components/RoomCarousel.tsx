import Image from 'next/image';
import Link from 'next/link';
import { Users, Maximize2 } from 'lucide-react';
import type { Room } from '@/modules/shared/types/database.types';

interface RoomCarouselProps {
    rooms: Room[];
}

export function RoomCarousel({ rooms }: RoomCarouselProps) {
    return (
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
            bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs
            flex flex-col justify-between group hover:shadow-xl transition duration-300
          "
                >
                    <div>
                        <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                            <Image
                                src={room.images[0]}
                                alt={room.name}
                                fill
                                sizes="(max-width: 768px) 88vw, 33vw"
                                className="object-cover group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                                {room.bed_type}
                            </div>
                        </div>

                        <div className="p-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-600 block mb-1">
                {room.tagline}
              </span>
                            <h3 className="font-bold text-lg text-slate-900 tracking-tight">{room.name}</h3>
                            <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                                {room.description}
                            </p>

                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-slate-500 text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Max {room.max_guests} Guests
                </span>
                                <span className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                                    {room.size_sqm} m²
                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Nightly</span>
                            <div className="flex items-baseline gap-1">
                                <span className="font-black text-xl text-slate-900">${room.price_per_night}</span>
                                <span className="text-slate-400 text-xs">/night</span>
                            </div>
                        </div>

                        <Link
                            href={`/rooms/${room.slug}`}
                            className="min-h-[44px] px-5 flex items-center justify-center bg-slate-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-800 transition"
                        >
                            Details
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}