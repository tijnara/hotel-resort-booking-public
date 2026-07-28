import { Header } from '@/modules/shared/components/Header';
import { BookingBar } from '@/modules/bookings/components/BookingBar';
import { RoomCarousel } from '@/modules/rooms/components/RoomCarousel';
import { getRooms } from '@/modules/rooms/services/getRooms';

export default async function HomePage() {
  const rooms = await getRooms();

  return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 md:pb-12">
        <Header />

        {/* Hero Section */}
        <section className="relative bg-slate-950 text-white pt-16 pb-24 px-5">
          <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
            A Coastal Sanctuary
          </span>
            <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-slate-100">
              Where Horizon Meets Tranquility.
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
              Minimalist oceanfront suites crafted for quiet luxury, undisturbed views, and modern coastal living.
            </p>
          </div>

          {/* Floating Desktop Booking Bar */}
          <div className="mt-12">
            <BookingBar />
          </div>
        </section>

        {/* Room Selection Carousel */}
        <section id="rooms" className="max-w-7xl mx-auto px-5 pt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Accommodations</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
                Curated Stays & Suites
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-2 md:mt-0">Swipe to explore rooms $\rightarrow$</p>
          </div>

          <RoomCarousel rooms={rooms} />
        </section>
      </div>
  );
}