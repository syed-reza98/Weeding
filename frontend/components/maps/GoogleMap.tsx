'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapProps {
  address: string;
  venue: string;
  className?: string;
}

export default function GoogleMap({ address, venue, className = '' }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const initMap = async () => {
      // For demo purposes, we'll show a placeholder map
      // In production, you would use a real Google Maps API key
      const loader = new Loader({
        apiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with actual API key
        version: 'weekly',
        libraries: ['places']
      });

      try {
        const { Map } = await loader.importLibrary('maps');
        const { Geocoder } = await loader.importLibrary('geocoding');
        
        if (!mapRef.current) return;

        // Default location (Dhaka, Bangladesh)
        const defaultLocation = { lat: 23.8103, lng: 90.4125 };
        
        const map = new Map(mapRef.current, {
          center: defaultLocation,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        mapInstanceRef.current = map;

        // Try to geocode the address
        const geocoder = new Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            map.setCenter(location);
            
            new google.maps.Marker({
              position: location,
              map: map,
              title: venue,
            });
          } else {
            // Fallback: show default location with marker
            new google.maps.Marker({
              position: defaultLocation,
              map: map,
              title: venue,
            });
          }
        });

      } catch (error) {
        console.error('Error loading Google Maps:', error);
        // Show fallback content
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gray-100 text-gray-500">
              <div class="text-center">
                <div class="text-lg mb-2">📍</div>
                <p class="text-sm">Interactive map loading...</p>
                <p class="text-xs text-gray-400">(Requires Google Maps API key)</p>
              </div>
            </div>
          `;
        }
      }
    };

    initMap();

    return () => {
      mapInstanceRef.current = null;
    };
  }, [address, venue]);

  // Fallback UI for development
  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg bg-gray-100 border-2 border-dashed border-gray-300"
        style={{ minHeight: '300px' }}
      >
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center p-4">
            <div className="text-4xl mb-3">🗺️</div>
            <h3 className="font-semibold mb-2">{venue}</h3>
            <p className="text-sm text-gray-600 mb-2">{address}</p>
            <p className="text-xs text-gray-400">
              Google Maps integration ready
              <br />
              (Add API key to enable interactive maps)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}