'use client';

import React from 'react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEvents } from '@/hooks/useApi';
import { Event } from '@/types/wedding';

export default function EventsPage() {
  const { language } = useLanguage();
  const { data: events, loading, error } = useEvents(language);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading events: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const eventList = events && Array.isArray(events) ? events : [
    {
      id: 1,
      name: "Mehendi Ceremony",
      description: "Traditional henna ceremony with music and dance",
      event_date: "2024-12-13T18:00:00.000000Z",
      venue_name: "Bride's Home",
      venue_address: "123 Wedding Street, Dhaka, Bangladesh",
      dress_code: "Traditional Indian wear in yellow/orange colors",
      is_active: true
    },
    {
      id: 2,
      name: "Holud Ceremony", 
      description: "Bengali turmeric ceremony with traditional rituals",
      event_date: "2024-12-14T10:00:00.000000Z",
      venue_name: "Groom's Home",
      venue_address: "456 Celebration Avenue, Dhaka, Bangladesh",
      dress_code: "Traditional Bengali attire in yellow",
      is_active: true
    },
    {
      id: 3,
      name: "Wedding Ceremony",
      description: "The main wedding ceremony with traditional vows",
      event_date: "2024-12-15T10:00:00.000000Z", 
      venue_name: "Local Community Center",
      venue_address: "789 Garden Plaza, Dhaka, Bangladesh",
      dress_code: "Formal traditional Indian wedding attire",
      is_active: true
    },
    {
      id: 4,
      name: "Reception Party",
      description: "Celebration dinner and dance party",
      event_date: "2024-12-15T19:00:00.000000Z",
      venue_name: "Grand Ballroom",
      venue_address: "101 Reception Boulevard, Dhaka, Bangladesh", 
      dress_code: "Cocktail or formal evening wear",
      is_active: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center">Wedding Events</h1>
          <p className="text-lg text-gray-600 text-center mt-4">
            Join us for a multi-day celebration of love and tradition
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:gap-12">
          {eventList.map((event: Event, index: number) => (
            <div 
              key={event.id} 
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } md:flex`}
            >
              {/* Event Image Placeholder */}
              <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-rose-200 to-pink-200 flex items-center justify-center">
                <Calendar className="h-16 w-16 text-rose-500" />
              </div>

              {/* Event Details */}
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-2 text-rose-500 text-sm font-medium mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(event.event_date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {event.name}
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-rose-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(event.event_date).toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-rose-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{event.venue_name}</p>
                      <p className="text-gray-600 text-sm">{event.venue_address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-rose-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Dress Code</p>
                      <p className="text-gray-600 text-sm">{event.dress_code}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RSVP Call to Action */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join Us?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Please let us know which events you&apos;ll be attending so we can plan accordingly.
          </p>
          <button className="bg-rose-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-rose-600 transition-colors">
            RSVP Now
          </button>
        </div>
      </div>
    </div>
  );
}