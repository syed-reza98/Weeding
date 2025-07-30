'use client';

import React, { useState } from 'react';
import { Hotel, MapPin, Star, Wifi, Car, Coffee, ExternalLink, Phone } from 'lucide-react';

interface Accommodation {
  id: number;
  name: string;
  type: 'hotel' | 'resort' | 'guesthouse';
  address: string;
  distance_from_venue: string;
  rating: number;
  price_range: string;
  booking_url?: string;
  phone: string;
  amenities: string[];
  description: string;
  image_url?: string;
  availability_status: 'available' | 'limited' | 'full';
}

export default function AccommodationPage() {
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);

  // Sample accommodation data (in real app, this would come from API)
  const accommodations: Accommodation[] = [
    {
      id: 1,
      name: 'Grand Palace Hotel',
      type: 'hotel',
      address: '123 Wedding Street, Dhaka, Bangladesh',
      distance_from_venue: '0.5 km from main venue',
      rating: 4.5,
      price_range: '$80-120 per night',
      booking_url: 'https://example.com/booking',
      phone: '+880 1234-567890',
      amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Room Service', 'Airport Shuttle'],
      description: 'Luxury hotel located closest to the wedding venue. Features elegant rooms with modern amenities and excellent service.',
      availability_status: 'available'
    },
    {
      id: 2,
      name: 'Heritage Resort & Spa',
      type: 'resort',
      address: '456 Garden Avenue, Dhaka, Bangladesh',
      distance_from_venue: '2 km from main venue',
      rating: 4.8,
      price_range: '$120-180 per night',
      booking_url: 'https://example.com/booking2',
      phone: '+880 1234-567891',
      amenities: ['Free WiFi', 'Spa', 'Pool', 'Restaurant', 'Gym', 'Conference Room'],
      description: 'Premium resort with spa facilities and beautiful gardens. Perfect for guests wanting luxury and relaxation.',
      availability_status: 'limited'
    },
    {
      id: 3,
      name: 'Comfort Inn Express',
      type: 'hotel',
      address: '789 Budget Street, Dhaka, Bangladesh', 
      distance_from_venue: '3 km from main venue',
      rating: 4.0,
      price_range: '$45-65 per night',
      booking_url: 'https://example.com/booking3',
      phone: '+880 1234-567892',
      amenities: ['Free WiFi', 'Breakfast', 'Parking', 'Air Conditioning'],
      description: 'Budget-friendly hotel with clean, comfortable rooms and essential amenities. Great value for money.',
      availability_status: 'available'
    },
    {
      id: 4,
      name: 'Traditional Guesthouse',
      type: 'guesthouse',
      address: '321 Heritage Lane, Dhaka, Bangladesh',
      distance_from_venue: '1.5 km from main venue',
      rating: 4.2,
      price_range: '$30-50 per night',
      phone: '+880 1234-567893',
      amenities: ['Free WiFi', 'Traditional Breakfast', 'Cultural Experience'],
      description: 'Authentic Bengali guesthouse offering a cultural experience with traditional hospitality and local cuisine.',
      availability_status: 'available'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'limited':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'full':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'limited':
        return 'Limited Availability';
      case 'full':
        return 'Fully Booked';
      default:
        return 'Unknown';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi')) return <Wifi className="h-4 w-4" />;
    if (amenityLower.includes('parking') || amenityLower.includes('car')) return <Car className="h-4 w-4" />;
    if (amenityLower.includes('restaurant') || amenityLower.includes('breakfast') || amenityLower.includes('coffee')) return <Coffee className="h-4 w-4" />;
    return <Star className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Hotel className="h-6 w-6 text-rose-500" />
              <span className="text-xl font-semibold text-gray-900">Accommodation</span>
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
              Where to Stay
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;ve reserved special rates at these recommended hotels and accommodations near our wedding venues.
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-blue-800 mb-2">Booking Information</h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Special wedding rates are available until December 1, 2024</li>
              <li>• Mention &quot;Sarah & Ahmad Wedding&quot; when booking for discounted rates</li>
              <li>• Free shuttle service available from Grand Palace Hotel to wedding venues</li>
              <li>• Contact us if you need help with bookings or have special requirements</li>
            </ul>
          </div>

          {/* Accommodation Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {accommodations.map((accommodation) => (
              <div key={accommodation.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Hotel Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                  <Hotel className="h-16 w-16 text-rose-300" />
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                        {accommodation.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center mr-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(accommodation.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">
                            ({accommodation.rating})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(accommodation.availability_status)}`}>
                      {getStatusText(accommodation.availability_status)}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-gray-600 text-sm">{accommodation.address}</p>
                        <p className="text-rose-500 text-sm font-medium">{accommodation.distance_from_venue}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-gray-600 text-sm">{accommodation.phone}</p>
                    </div>

                    <div>
                      <p className="text-lg font-semibold text-gray-800">{accommodation.price_range}</p>
                    </div>

                    <p className="text-gray-600 text-sm">{accommodation.description}</p>
                  </div>

                  {/* Amenities */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Amenities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {accommodation.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          {getAmenityIcon(amenity)}
                          <span className="ml-2">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {accommodation.booking_url ? (
                      <a
                        href={accommodation.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-rose-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors flex items-center justify-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Book Now
                      </a>
                    ) : (
                      <button
                        onClick={() => setSelectedAccommodation(accommodation)}
                        className="flex-1 bg-rose-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors flex items-center justify-center"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Contact to Book
                      </button>
                    )}
                    <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      View on Map
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Transportation</h2>
              <div className="space-y-4 text-gray-600">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">From Airport</h3>
                  <p className="text-sm">Hazrat Shahjalal International Airport is 45 minutes from the venue area. Taxi and rideshare services are readily available.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Shuttle Service</h3>
                  <p className="text-sm">Free shuttle service from Grand Palace Hotel to all wedding venues. Schedule will be shared closer to the event date.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Need Help?</h2>
              <div className="space-y-4 text-gray-600">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Accommodation Coordinator</h3>
                  <p className="text-sm">Sarah&apos;s Sister - Fatima</p>
                  <p className="text-sm">+880 1234-567894</p>
                  <p className="text-sm">accommodation@sarahahmad-wedding.com</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Special Requirements</h3>
                  <p className="text-sm">Please contact us if you need accessible rooms, dietary accommodations, or have other special requirements.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {selectedAccommodation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contact {selectedAccommodation.name}</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-800">Phone</p>
                  <p className="text-gray-600">{selectedAccommodation.phone}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Special Rate Code</p>
                  <p className="text-gray-600">Sarah & Ahmad Wedding</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Booking Deadline</p>
                  <p className="text-gray-600">December 1, 2024</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <a
                  href={`tel:${selectedAccommodation.phone}`}
                  className="flex-1 bg-rose-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-rose-600 transition-colors text-center"
                >
                  Call Now
                </a>
                <button
                  onClick={() => setSelectedAccommodation(null)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}