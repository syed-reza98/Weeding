'use client';

import React from 'react';
import { MapPin, Navigation, Phone, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEvents } from '@/hooks/useApi';
import { Event } from '@/types/wedding';
import GoogleMap from '@/components/maps/GoogleMap';

export default function LocationsPage() {
  const { language } = useLanguage();
  const { data: events, loading, error } = useEvents(language);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading locations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading locations: {error}</p>
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

  const eventLocations = events && Array.isArray(events) ? events : [];

  const getDirectionsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-rose-500" />
              <span className="text-xl font-semibold text-gray-900">Wedding Locations</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-600 hover:text-rose-500 transition-colors">
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Wedding Locations
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find all the venues where our celebrations will take place. Get directions and venue details for each event.
            </p>
          </div>

          {/* Event Locations */}
          <div className="grid gap-8 md:grid-cols-2">
            {eventLocations.map((event: Event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  {/* Event Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                        {event.name}
                      </h3>
                      <div className="flex items-center text-rose-500 mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">
                          {new Date(event.event_date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Venue Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Venue</h4>
                      <p className="text-gray-600">{event.venue_name}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        Address
                      </h4>
                      <p className="text-gray-600">{event.venue_address}</p>
                    </div>

                    {event.dress_code && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Dress Code</h4>
                        <p className="text-gray-600">{event.dress_code}</p>
                      </div>
                    )}
                  </div>

                  {/* Google Map */}
                  <div className="mt-6">
                    <GoogleMap 
                      address={event.venue_address}
                      venue={event.venue_name}
                      className="h-48"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <a
                      href={getDirectionsUrl(event.venue_address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-rose-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors flex items-center justify-center"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </a>
                    <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Venue
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* General Information */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Transportation & Parking</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Public Transportation</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Bus routes available to all venues</li>
                  <li>• Rideshare services recommended</li>
                  <li>• Contact us for group transportation</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Parking Information</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Free parking available at all venues</li>
                  <li>• Valet service at main ceremony venue</li>
                  <li>• Security provided for all parking areas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Emergency Contacts
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-amber-700">
              <div>
                <p className="font-medium">Wedding Coordinator</p>
                <p>+880 1234-567890</p>
              </div>
              <div>
                <p className="font-medium">Transportation Coordinator</p>
                <p>+880 1234-567891</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}