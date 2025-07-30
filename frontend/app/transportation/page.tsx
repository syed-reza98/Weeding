'use client';

import React, { useState } from 'react';
import { Bus, Car, Plane, Clock, MapPin, Phone, Users, AlertCircle } from 'lucide-react';

interface TransportRoute {
  id: number;
  name: string;
  type: 'bus' | 'car' | 'shuttle';
  departure_location: string;
  destination: string;
  departure_times: string[];
  duration: string;
  capacity: number;
  cost: string;
  contact_person: string;
  contact_phone: string;
  notes?: string;
  is_available: boolean;
}

export default function TransportationPage() {
  const [selectedRoute, setSelectedRoute] = useState<TransportRoute | null>(null);

  // Sample transportation data (in real app, this would come from API)
  const transportRoutes: TransportRoute[] = [
    {
      id: 1,
      name: 'Airport Shuttle Service',
      type: 'shuttle',
      departure_location: 'Hazrat Shahjalal International Airport',
      destination: 'Grand Palace Hotel',
      departure_times: ['10:00 AM', '2:00 PM', '6:00 PM', '10:00 PM'],
      duration: '45 minutes',
      capacity: 12,
      cost: 'Free for wedding guests',
      contact_person: 'Driver Rahman',
      contact_phone: '+880 1234-567895',
      notes: 'Please book 24 hours in advance. Show wedding invitation for free service.',
      is_available: true
    },
    {
      id: 2,
      name: 'Hotel to Venues Shuttle',
      type: 'bus',
      departure_location: 'Grand Palace Hotel',
      destination: 'All Wedding Venues',
      departure_times: ['8:00 AM', '12:00 PM', '4:00 PM', '8:00 PM'],
      duration: '15-30 minutes',
      capacity: 25,
      cost: 'Free for wedding guests',
      contact_person: 'Coordinator Ali',
      contact_phone: '+880 1234-567896',
      notes: 'Stops at all major hotels and wedding venues. No advance booking required.',
      is_available: true
    },
    {
      id: 3,
      name: 'Private Car Service',
      type: 'car',
      departure_location: 'Any location in Dhaka',
      destination: 'Wedding venues or hotels',
      departure_times: ['Available 24/7'],
      duration: 'Varies by location',
      capacity: 4,
      cost: '800-1500 BDT per trip',
      contact_person: 'Taxi Service Manager',
      contact_phone: '+880 1234-567897',
      notes: 'Professional drivers familiar with all venue locations. English speaking available.',
      is_available: true
    },
    {
      id: 4,
      name: 'Group Charter Bus',
      type: 'bus',
      departure_location: 'Coordinated pickup points',
      destination: 'Wedding venues',
      departure_times: ['To be coordinated'],
      duration: 'Varies',
      capacity: 50,
      cost: 'Contact for pricing',
      contact_person: 'Charter Coordinator',
      contact_phone: '+880 1234-567898',
      notes: 'Perfect for large groups. Can arrange pickup from multiple locations.',
      is_available: true
    }
  ];

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'bus':
        return <Bus className="h-6 w-6" />;
      case 'car':
        return <Car className="h-6 w-6" />;
      case 'shuttle':
        return <Bus className="h-6 w-6" />;
      default:
        return <Car className="h-6 w-6" />;
    }
  };

  const getTransportColor = (type: string) => {
    switch (type) {
      case 'bus':
        return 'text-blue-600 bg-blue-50';
      case 'car':
        return 'text-green-600 bg-green-50';
      case 'shuttle':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bus className="h-6 w-6 text-rose-500" />
              <span className="text-xl font-semibold text-gray-900">Transportation</span>
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
              Transportation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting to and from our wedding venues is easy! We&apos;ve arranged multiple transportation options for your convenience.
            </p>
          </div>

          {/* Important Information */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-amber-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">Important Transportation Information</h3>
                <ul className="text-amber-700 space-y-1 text-sm">
                  <li>• Free shuttle service available between hotels and venues</li>
                  <li>• Airport pickup requires 24-hour advance booking</li>
                  <li>• All venues have ample parking for personal vehicles</li>
                  <li>• Contact transportation coordinator for special requirements</li>
                  <li>• Emergency transportation available 24/7 during wedding weekend</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Transportation Options */}
          <div className="grid gap-6 md:grid-cols-2">
            {transportRoutes.map((route) => (
              <div key={route.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${getTransportColor(route.type)} mr-4`}>
                        {getTransportIcon(route.type)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{route.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{route.type} Service</p>
                      </div>
                    </div>
                    {route.is_available && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Available
                      </span>
                    )}
                  </div>

                  {/* Route Details */}
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">From</p>
                            <p className="text-sm text-gray-600">{route.departure_location}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">To</p>
                            <p className="text-sm text-gray-600">{route.destination}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">Duration</p>
                          <p className="text-sm text-gray-600">{route.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">Capacity</p>
                          <p className="text-sm text-gray-600">{route.capacity} passengers</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Cost</p>
                        <p className="text-sm text-gray-600">{route.cost}</p>
                      </div>
                    </div>
                  </div>

                  {/* Departure Times */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Departure Times</h4>
                    <div className="flex flex-wrap gap-2">
                      {route.departure_times.map((time, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {route.notes && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">Important Notes</h4>
                      <p className="text-sm text-gray-600">{route.notes}</p>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{route.contact_person}</p>
                        <p className="text-sm text-gray-600">{route.contact_phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`tel:${route.contact_phone}`}
                          className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors flex items-center"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </a>
                        <button
                          onClick={() => setSelectedRoute(route)}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Plane className="h-8 w-8 text-blue-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">Flying In?</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Hazrat Shahjalal International Airport (DAC) is the closest airport, about 45 minutes from the venue area.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Free shuttle service available</li>
                <li>• Taxi services readily available</li>
                <li>• Book airport pickup in advance</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Car className="h-8 w-8 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">Driving?</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                All venues have free parking available with security provided throughout the events.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Free parking at all venues</li>
                <li>• Valet service at main ceremony</li>
                <li>• Security provided</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Phone className="h-8 w-8 text-purple-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">Need Help?</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Our transportation coordinator is available to help with all your travel needs.
              </p>
              <div className="text-gray-600 text-sm space-y-1">
                <p><strong>Ahmad&apos;s Brother - Karim</strong></p>
                <p>+880 1234-567899</p>
                <p>transport@sarahahmad-wedding.com</p>
              </div>
            </div>
          </div>

          {/* Emergency Transportation */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Emergency Transportation
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-red-700">
              <div>
                <p className="font-medium">24/7 Emergency Contact</p>
                <p>+880 1234-567900</p>
                <p className="text-sm">Available during wedding weekend</p>
              </div>
              <div>
                <p className="font-medium">Local Taxi Services</p>
                <p>Uber, Pathao available</p>
                <p className="text-sm">Download apps before arrival</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Details Modal */}
      {selectedRoute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${getTransportColor(selectedRoute.type)} mr-4`}>
                  {getTransportIcon(selectedRoute.type)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedRoute.name}</h3>
                  <p className="text-gray-600 capitalize">{selectedRoute.type} Service</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Route Information</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>From:</strong> {selectedRoute.departure_location}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>To:</strong> {selectedRoute.destination}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Duration:</strong> {selectedRoute.duration}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Cost:</strong> {selectedRoute.cost}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Contact</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Contact Person:</strong> {selectedRoute.contact_person}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Phone:</strong> {selectedRoute.contact_phone}
                  </p>
                </div>

                {selectedRoute.notes && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">{selectedRoute.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={`tel:${selectedRoute.contact_phone}`}
                  className="flex-1 bg-rose-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-rose-600 transition-colors text-center"
                >
                  Call Now
                </a>
                <button
                  onClick={() => setSelectedRoute(null)}
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