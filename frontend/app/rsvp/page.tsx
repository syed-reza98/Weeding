'use client';

import { useState, useEffect } from 'react';
import { Users, Check, X, Heart, UserPlus, LogIn } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEvents } from '@/hooks/useApi';
import { Event } from '@/types/wedding';
import { login, register, submitRSVP, getProfile } from '@/lib/api/client';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  language_preference: string;
}

export default function RSVPPage() {
  const { language } = useLanguage();
  const { data: events, loading: eventsLoading } = useEvents(language);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: ''
  });

  const [rsvpForm, setRsvpForm] = useState({
    event_id: 0,
    guest_count: 1,
    dietary_restrictions: '',
    special_requests: '',
    status: 'confirmed' as 'confirmed' | 'declined'
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await getProfile();
      if (response.success) {
        setUser(response.data);
      }
    } catch (err) {
      // User not authenticated
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = authMode === 'login' 
        ? await login({ email: authForm.email, password: authForm.password })
        : await register({
            name: authForm.name,
            email: authForm.email,
            password: authForm.password,
            password_confirmation: authForm.password_confirmation,
            phone: authForm.phone,
            language_preference: language
          });

      if (response.success) {
        setUser(response.data.user);
        setShowAuthForm(false);
        setSuccess('Successfully logged in!');
      } else {
        setError('Authentication failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    setError(null);

    try {
      const response = await submitRSVP(rsvpForm);
      if (response.success) {
        setSuccess('RSVP submitted successfully!');
        setRsvpForm({
          event_id: 0,
          guest_count: 1,
          dietary_restrictions: '',
          special_requests: '',
          status: 'confirmed'
        });
      } else {
        setError('Failed to submit RSVP');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit RSVP');
    } finally {
      setSubmitting(false);
    }
  };

  const eventList = events && Array.isArray(events) ? events : [
    {
      id: 1,
      name: "Mehendi Ceremony",
      event_date: "2024-12-13T18:00:00.000000Z",
      venue_name: "Bride's Home"
    },
    {
      id: 2,
      name: "Holud Ceremony",
      event_date: "2024-12-14T10:00:00.000000Z",
      venue_name: "Groom's Home"
    },
    {
      id: 3,
      name: "Wedding Ceremony",
      event_date: "2024-12-15T10:00:00.000000Z",
      venue_name: "Local Community Center"
    },
    {
      id: 4,
      name: "Reception Party",
      event_date: "2024-12-15T19:00:00.000000Z",
      venue_name: "Grand Ballroom"
    }
  ];

  if (loading || eventsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">RSVP</h1>
            <p className="text-lg text-gray-600">
              Please confirm your attendance for our special day
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {!user ? (
          /* Authentication Required */
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Heart className="h-16 w-16 text-rose-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-8">
              You need to sign in or create an account to RSVP to our wedding events.
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => { setAuthMode('login'); setShowAuthForm(true); }}
                className="flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors"
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </button>
              <button
                onClick={() => { setAuthMode('register'); setShowAuthForm(true); }}
                className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <UserPlus className="h-5 w-5" />
                Create Account
              </button>
            </div>

            {/* Auth Form Modal */}
            {showAuthForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {authMode === 'login' ? 'Sign In' : 'Create Account'}
                  </h3>
                  
                  <form onSubmit={handleAuth} className="space-y-4">
                    {authMode === 'register' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={authForm.name}
                          onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={authForm.email}
                        onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>

                    {authMode === 'register' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone (Optional)
                        </label>
                        <input
                          type="tel"
                          value={authForm.phone}
                          onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={authForm.password}
                        onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>

                    {authMode === 'register' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          required
                          value={authForm.password_confirmation}
                          onChange={(e) => setAuthForm({ ...authForm, password_confirmation: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                    )}
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50"
                      >
                        {submitting ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAuthForm(false)}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>

                  <p className="text-center text-sm text-gray-600 mt-4">
                    {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button
                      onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                      className="text-rose-500 hover:underline"
                    >
                      {authMode === 'login' ? 'Create one' : 'Sign in'}
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* RSVP Form */
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                <Check className="h-6 w-6" />
                <span className="font-medium">Welcome back, {user.name}!</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Submit Your RSVP</h2>
            </div>

            <form onSubmit={handleRSVP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which event would you like to RSVP for?
                </label>
                <select
                  required
                  value={rsvpForm.event_id}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, event_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value={0}>Select an event</option>
                  {eventList.map((event: Event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} - {new Date(event.event_date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Will you attend?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="confirmed"
                      checked={rsvpForm.status === 'confirmed'}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, status: e.target.value as 'confirmed' | 'declined' })}
                      className="mr-2"
                    />
                    <Check className="h-5 w-5 text-green-500 mr-1" />
                    Yes, I'll be there!
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="declined"
                      checked={rsvpForm.status === 'declined'}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, status: e.target.value as 'confirmed' | 'declined' })}
                      className="mr-2"
                    />
                    <X className="h-5 w-5 text-red-500 mr-1" />
                    Sorry, can't make it
                  </label>
                </div>
              </div>

              {rsvpForm.status === 'confirmed' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of guests (including yourself)
                    </label>
                    <select
                      value={rsvpForm.guest_count}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, guest_count: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dietary restrictions or allergies
                    </label>
                    <textarea
                      value={rsvpForm.dietary_restrictions}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, dietary_restrictions: e.target.value })}
                      placeholder="Please let us know about any dietary restrictions..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special requests or notes
                    </label>
                    <textarea
                      value={rsvpForm.special_requests}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, special_requests: e.target.value })}
                      placeholder="Any special requests or things we should know..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={submitting || rsvpForm.event_id === 0}
                className="w-full bg-rose-500 text-white py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit RSVP'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}