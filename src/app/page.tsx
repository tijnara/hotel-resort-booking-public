import { Header } from '@/modules/shared/components/Header';
import { BookingBar } from '@/modules/bookings/components/BookingBar';
import { RoomCarousel } from '@/modules/rooms/components/RoomCarousel';
import { getRooms } from '@/modules/rooms/services/getRooms';

export default async function HomePage() {
  const rooms = await getRooms();

  return (
      <div className="min-h-screen bg-[#faf7f2] text-[#1c120c] pb-28 md:pb-12">
        <Header />

        {/* Hero Section */}
        <section className="relative bg-[#1c120c] text-[#faf7f2] pt-16 pb-24 px-5 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#c89349]">
            Modern Filipino Coastal Sanctuary
          </span>
            <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-[#faf7f2]">
              Bamboo, Capiz & Unbroken Ocean Views.
            </h1>
            <p className="text-sm sm:text-base text-[#e6c898]/80 max-w-xl mx-auto font-light leading-relaxed">
              Handcrafted beachfront Kubo villas blending ancestral Philippine architecture with modern minimalist luxury.
            </p>
          </div>

          {/* Floating Desktop Booking Bar */}
          <div className="mt-12 relative z-10">
            <BookingBar />
          </div>
        </section>

        {/* Room Selection Carousel */}
        <section id="villas" className="max-w-7xl mx-auto px-5 pt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Accommodations</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c120c] mt-1">
                Handcrafted Kubo Villas
              </h2>
            </div>
            <p className="text-xs text-[#2b1d14]/60 mt-2 md:mt-0">Swipe to view suites →</p>
          </div>

          <RoomCarousel rooms={rooms} />
        </section>
      </div>
  );
}
