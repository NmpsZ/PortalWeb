import { API_BASE_URL } from '../utils/constants';
import { UserProfile, UpdateContactRequest, ProfileHistory } from '../types';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = new Headers(options.headers);

    // If not FormData, set Content-Type to application/json
    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorJson = await response.json();
          throw new Error(errorJson.message || `HTTP Error ${response.status}`);
        } catch (err: any) {
          // If it was already thrown above, rethrow
          if (err.message && !err.message.includes('JSON')) {
            throw err;
          }
        }
      }
      const errorText = await response.text();
      throw new Error(errorText || `HTTP Error ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as T;
    }
    return (await response.text()) as unknown as T;
  }

  // Profile API calls
  getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/profile');
  }

  updateContact(data: UpdateContactRequest): Promise<UserProfile> {
    return this.request<UserProfile>('/profile/contact', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  updateSkills(skills: string[]): Promise<UserProfile> {
    return this.request<UserProfile>('/profile/skills', {
      method: 'PUT',
      body: JSON.stringify({ skills }),
    });
  }

  uploadPhoto(file: File): Promise<UserProfile> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.request<UserProfile>('/profile/photo', {
      method: 'POST',
      body: formData,
    });
  }

  getSkills(): Promise<string[]> {
    return this.request<string[]>('/skills');
  }

  getHistory(days: number = 7): Promise<ProfileHistory[]> {
    return this.request<ProfileHistory[]>(`/profile/history?days=${days}`);
  }
}

export const apiService = new ApiService();
export default apiService;
