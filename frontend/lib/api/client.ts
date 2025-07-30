import { ApiResponse, Event, Content, Accommodation, Transportation, Media, GuestbookMessage, RSVP } from '@/types/wedding';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  language_preference: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('wedding_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('wedding_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wedding_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication API
  async register(userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
    language_preference?: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async logout(): Promise<ApiResponse<Record<string, never>>> {
    const response = await this.request<Record<string, never>>('/auth/logout', {
      method: 'POST',
    });
    
    this.clearToken();
    return response;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/profile');
  }

  async updateProfile(userData: {
    name?: string;
    phone?: string;
    language_preference?: string;
  }): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Events API
  async getEvents(language: string = 'en'): Promise<ApiResponse<Event[]>> {
    return this.request<Event[]>('/events', {
      headers: {
        'Accept-Language': language,
      },
    });
  }

  async getEvent(id: number, language: string = 'en'): Promise<ApiResponse<Event>> {
    return this.request<Event>(`/events/${id}`, {
      headers: {
        'Accept-Language': language,
      },
    });
  }

  // Content API
  async getContent(section: string, language: string = 'en'): Promise<ApiResponse<Content>> {
    return this.request<Content>(`/content/${section}`, {
      headers: {
        'Accept-Language': language,
      },
    });
  }

  async getContentByKey(section: string, key: string, language: string = 'en'): Promise<ApiResponse<string>> {
    return this.request<string>(`/content/${section}/${key}`, {
      headers: {
        'Accept-Language': language,
      },
    });
  }

  // Accommodations API
  async getAccommodations(language: string = 'en'): Promise<ApiResponse<Accommodation[]>> {
    return this.request<Accommodation[]>('/accommodations', {
      headers: {
        'Accept-Language': language,
      },
    });
  }

  // Transportation API
  async getTransportation(language: string = 'en'): Promise<ApiResponse<Transportation[]>> {
    return this.request<Transportation[]>('/transportation', {
      headers: {
        'Accept-Language': language,
      },
    });
  }

  // Gallery API
  async getGallery(): Promise<ApiResponse<Media[]>> {
    return this.request<Media[]>('/gallery');
  }

  async getMedia(id: number): Promise<ApiResponse<Media>> {
    return this.request<Media>(`/gallery/${id}`);
  }

  // RSVP API
  async submitRSVP(rsvpData: {
    event_id: number;
    guest_count: number;
    dietary_restrictions?: string;
    special_requests?: string;
    status: 'confirmed' | 'declined';
  }): Promise<ApiResponse<RSVP>> {
    return this.request<RSVP>('/rsvp', {
      method: 'POST',
      body: JSON.stringify(rsvpData),
    });
  }

  async getRSVP(guestId: number): Promise<ApiResponse<RSVP[]>> {
    return this.request<RSVP[]>(`/rsvp/${guestId}`);
  }

  // Guestbook API
  async getGuestbook(): Promise<ApiResponse<GuestbookMessage[]>> {
    return this.request<GuestbookMessage[]>('/guestbook');
  }

  async postGuestbookMessage(messageData: {
    guest_name: string;
    message: string;
  }): Promise<ApiResponse<GuestbookMessage>> {
    return this.request<GuestbookMessage>('/guestbook', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/health');
  }
}

export const apiClient = new ApiClient();

// Authentication functions
export const register = (userData: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  language_preference?: string;
}) => apiClient.register(userData);

export const login = (credentials: { email: string; password: string }) => apiClient.login(credentials);
export const logout = () => apiClient.logout();
export const getProfile = () => apiClient.getProfile();
export const updateProfile = (userData: {
  name?: string;
  phone?: string;
  language_preference?: string;
}) => apiClient.updateProfile(userData);

// Content functions
export const getEvents = (language?: string) => apiClient.getEvents(language);
export const getEvent = (id: number, language?: string) => apiClient.getEvent(id, language);
export const getContent = (section: string, language?: string) => apiClient.getContent(section, language);
export const getAccommodations = (language?: string) => apiClient.getAccommodations(language);
export const getTransportation = (language?: string) => apiClient.getTransportation(language);
export const getGallery = () => apiClient.getGallery();
export const getGuestbook = () => apiClient.getGuestbook();

// Interactive functions
export const submitRSVP = (rsvpData: {
  event_id: number;
  guest_count: number;
  dietary_restrictions?: string;
  special_requests?: string;
  status: 'confirmed' | 'declined';
}) => apiClient.submitRSVP(rsvpData);

export const getRSVP = (guestId: number) => apiClient.getRSVP(guestId);
export const postGuestbookMessage = (messageData: { guest_name: string; message: string }) => 
  apiClient.postGuestbookMessage(messageData);