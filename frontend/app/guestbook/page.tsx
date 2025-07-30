'use client';

import React, { useState } from 'react';
import { MessageCircle, Heart, Send, User, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface GuestbookMessage {
  id: number;
  guest_name: string;
  message: string;
  created_at: string;
  is_approved: boolean;
}

export default function GuestbookPage() {
  const { language } = useLanguage();
  const [message, setMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sample guestbook messages (in real app, this would come from API)
  const messages: GuestbookMessage[] = [
    {
      id: 1,
      guest_name: 'Fatima Rahman',
      message: 'So excited to celebrate your special day! You two are perfect for each other. Can\'t wait to dance at the reception! 💕',
      created_at: '2024-12-01',
      is_approved: true
    },
    {
      id: 2,
      guest_name: 'Dr. Ahmed Hassan',
      message: 'Congratulations to the beautiful couple! May your love story continue to inspire us all. Looking forward to the ceremony!',
      created_at: '2024-11-28',
      is_approved: true
    },
    {
      id: 3,
      guest_name: 'Rashida & Family',
      message: 'We are so happy for both of you! Sarah, you look radiant, and Ahmad, you are one lucky man. See you at the mehendi!',
      created_at: '2024-11-25',
      is_approved: true
    },
    {
      id: 4,
      guest_name: 'Uncle Karim',
      message: 'Watching you both grow up and now getting married brings tears of joy to my eyes. May Allah bless your union with happiness and prosperity.',
      created_at: '2024-11-22',
      is_approved: true
    },
    {
      id: 5,
      guest_name: 'College Friends Group',
      message: 'From study buddies to soulmates! We knew this day would come. Can\'t wait to celebrate with the whole gang. Love you both!',
      created_at: '2024-11-20',
      is_approved: true
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guestName.trim() || !message.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setMessage('');
      setGuestName('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-6 w-6 text-rose-500" />
              <span className="text-xl font-semibold text-gray-900">Guestbook</span>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Guestbook
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leave us a message! We&apos;d love to hear your thoughts, wishes, and memories as we embark on this beautiful journey together.
            </p>
          </div>

          {/* Message Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Heart className="h-6 w-6 text-rose-500 mr-2" />
              Share Your Wishes
            </h2>
            
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-medium">
                  Thank you for your message! It will appear after approval.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="guestName"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                  placeholder="Share your wishes, memories, or thoughts for the happy couple..."
                  required
                  disabled={isSubmitting}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {message.length}/500 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !guestName.trim() || !message.trim()}
                className="w-full bg-rose-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-sm text-gray-500">
              <p>* All messages will be reviewed before appearing publicly</p>
              <p>* Please keep messages appropriate and family-friendly</p>
            </div>
          </div>

          {/* Messages Display */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Messages from Our Loved Ones ({messages.length})
            </h2>

            {messages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-rose-100 rounded-full p-3 mr-4">
                      <User className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{msg.guest_name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(msg.created_at)}
                      </div>
                    </div>
                  </div>
                  <Heart className="h-5 w-5 text-rose-400" />
                </div>
                
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-16">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No messages yet</h3>
                <p className="text-gray-500">Be the first to leave a message for the happy couple!</p>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="mt-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl text-white p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Can&apos;t Wait to Celebrate With You!</h2>
            <p className="text-lg opacity-90 mb-6">
              Your presence at our wedding means the world to us. Thank you for being part of our love story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/rsvp"
                className="bg-white text-rose-500 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                RSVP Now
              </a>
              <a
                href="/events"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-rose-500 transition-colors"
              >
                View Events
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}