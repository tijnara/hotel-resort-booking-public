export interface Room {
  id: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price_per_night: number;
  max_guests: number;
  bed_type: string;
  size_sqm: number;
  images: string[];
  is_available: boolean;
  is_hidden?: boolean;
  ical_sources?: Array<{
    id: string;
    name: string;
    url: string;
  }>;
  airbnb_ical_url?: string;
  booking_ical_url?: string;
}