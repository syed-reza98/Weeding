import { ApiResponse, Event, Content, Accommodation, Transportation, Media, GuestbookMessage } from '@/types/wedding';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

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

  // Guestbook API
  async getGuestbook(): Promise<ApiResponse<GuestbookMessage[]>> {
    return this.request<GuestbookMessage[]>('/guestbook');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/health');
  }
}

export const apiClient = new ApiClient();

// Convenience functions
export const getEvents = (language?: string) => apiClient.getEvents(language);
export const getEvent = (id: number, language?: string) => apiClient.getEvent(id, language);
export const getContent = (section: string, language?: string) => apiClient.getContent(section, language);
export const getAccommodations = (language?: string) => apiClient.getAccommodations(language);
export const getTransportation = (language?: string) => apiClient.getTransportation(language);
export const getGallery = () => apiClient.getGallery();
export const getGuestbook = () => apiClient.getGuestbook();