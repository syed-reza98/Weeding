'use client';

import { useState, useEffect, useMemo } from 'react';
import { Heart, Calendar, MapPin, Users, Camera, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEvents, useContent } from '@/hooks/useApi';
import { Event, Content } from '@/types/wedding';

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const { data: events, loading: eventsLoading } = useEvents(language);
  const { data: homeContent, loading: contentLoading } = useContent('home', language);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Wedding date - December 15, 2024
  const weddingDate = useMemo(() => new Date('2024-12-15T10:00:00'), []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  const handleLanguageSwitch = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  // Get content with fallbacks
  const getContent = (key: string, fallback: string) => {
    const content = homeContent as Content | null;
    return content?.content?.[key] || fallback;
  };

  if (eventsLoading || contentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wedding details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-rose-500" />
              <span className="text-xl font-semibold text-gray-900">
                {getContent('couple_names', 'Sarah & Ahmad')}
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-rose-500 transition-colors">Home</a>
              <a href="#events" className="text-gray-700 hover:text-rose-500 transition-colors">Events</a>
              <a href="#location" className="text-gray-700 hover:text-rose-500 transition-colors">Location</a>
              <a href="#rsvp" className="text-gray-700 hover:text-rose-500 transition-colors">RSVP</a>
              <a href="#gallery" className="text-gray-700 hover:text-rose-500 transition-colors">Gallery</a>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLanguageSwitch}
                className="text-sm text-gray-600 hover:text-rose-500 font-medium"
              >
                {language === 'en' ? 'বাংলা' : 'English'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4">
              {getContent('couple_names', 'Sarah & Ahmad').split(' ').map((name, index, array) => (
                <span key={index}>
                  {name}
                  {index < array.length - 2 && ' '}
                  {index === array.length - 2 && <span className="text-rose-500"> & </span>}
                  {index === array.length - 1 && ''}
                </span>
              ))}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              {getContent('wedding_date', 'December 15, 2024')} • Dhaka, Bangladesh
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {getContent('welcome_message', 'Join us as we celebrate our love story and begin our journey together as husband and wife')}
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-md mx-auto mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Until Our Big Day</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-500">{timeLeft.days}</div>
                <div className="text-sm text-gray-600">Days</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-500">{timeLeft.hours}</div>
                <div className="text-sm text-gray-600">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-500">{timeLeft.minutes}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-500">{timeLeft.seconds}</div>
                <div className="text-sm text-gray-600">Seconds</div>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <a href="#events" className="bg-white/80 backdrop-blur-sm rounded-xl p-6 hover:bg-white/90 transition-all hover:scale-105 shadow-md">
              <Calendar className="h-8 w-8 text-rose-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-800">Events</div>
            </a>
            <a href="#location" className="bg-white/80 backdrop-blur-sm rounded-xl p-6 hover:bg-white/90 transition-all hover:scale-105 shadow-md">
              <MapPin className="h-8 w-8 text-rose-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-800">Location</div>
            </a>
            <a href="#rsvp" className="bg-white/80 backdrop-blur-sm rounded-xl p-6 hover:bg-white/90 transition-all hover:scale-105 shadow-md">
              <Users className="h-8 w-8 text-rose-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-800">RSVP</div>
            </a>
            <a href="#gallery" className="bg-white/80 backdrop-blur-sm rounded-xl p-6 hover:bg-white/90 transition-all hover:scale-105 shadow-md">
              <Camera className="h-8 w-8 text-rose-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-800">Gallery</div>
            </a>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Love Story</h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-6">
              Our journey began in university where we first met in a computer science class. 
              What started as study sessions and late-night coding marathons slowly blossomed 
              into something beautiful.
            </p>
            <p>
              After years of friendship, love, and adventure together, Ahmad proposed during 
              a sunset walk by the Buriganga River. Now, we&apos;re excited to celebrate this 
              next chapter of our lives with our family and friends.
            </p>
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section id="events" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Wedding Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events && Array.isArray(events) && events.length > 0 ? (
              events.slice(0, 4).map((event: Event) => (
                <div key={event.id} className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.name}</h3>
                  <p className="text-rose-500 font-medium mb-1">
                    {new Date(event.event_date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-gray-600 mb-1">
                    {new Date(event.event_date).toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-gray-500 text-sm">{event.venue_name}</p>
                </div>
              ))
            ) : (
              // Fallback data when API is loading or fails
              [
                {
                  name: "Mehendi Ceremony",
                  date: "December 13, 2024",
                  time: "6:00 PM",
                  venue: "Bride&apos;s Home"
                },
                {
                  name: "Holud Ceremony", 
                  date: "December 14, 2024",
                  time: "10:00 AM",
                  venue: "Groom&apos;s Home"
                },
                {
                  name: "Wedding Ceremony",
                  date: "December 15, 2024", 
                  time: "10:00 AM",
                  venue: "Local Community Center"
                },
                {
                  name: "Reception",
                  date: "December 15, 2024",
                  time: "7:00 PM", 
                  venue: "Grand Ballroom"
                }
              ].map((event, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.name}</h3>
                  <p className="text-rose-500 font-medium mb-1">{event.date}</p>
                  <p className="text-gray-600 mb-1">{event.time}</p>
                  <p className="text-gray-500 text-sm">{event.venue}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-rose-400" />
            <span className="text-xl font-semibold">
              {getContent('couple_names', 'Sarah & Ahmad')}
            </span>
          </div>
          <p className="text-gray-400 mb-6">
            We can&apos;t wait to celebrate with you!
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#guestbook" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <MessageCircle className="h-5 w-5" />
              <span>Guestbook</span>
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
