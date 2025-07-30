// Types for wedding website
export interface Event {
  id: number;
  name: string;
  description: string;
  event_date: string;
  venue_name: string;
  venue_address: string;
  dress_code: string;
  is_active: boolean;
  rsvp_count?: number;
  media_count?: number;
}

export interface Content {
  section: string;
  language: string;
  content: {
    [key: string]: string;
  };
}

export interface Accommodation {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website_url: string;
  price_range: string;
  amenities: string[];
  is_recommended: boolean;
}

export interface Transportation {
  id: number;
  route_name: string;
  pickup_locations: string[];
  departure_time: string;
  arrival_time: string;
  driver_contact: string;
  capacity: number;
}

export interface RSVP {
  id?: number;
  guest_name: string;
  email: string;
  phone?: string;
  number_of_guests: number;
  dietary_restrictions?: string;
  special_requests?: string;
  events: number[];
  accommodation_needed: boolean;
  transportation_needed: boolean;
  status: 'pending' | 'confirmed' | 'declined';
}

export interface Media {
  id: number;
  title: string;
  description?: string;
  file_path: string;
  file_type: 'image' | 'video';
  is_approved: boolean;
  uploaded_by?: string;
  created_at: string;
}

export interface GuestbookMessage {
  id: number;
  guest_name: string;
  message: string;
  is_approved: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}