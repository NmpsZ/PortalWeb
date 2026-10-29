export interface UserProfile {
  id: number;
  full_name: string;
  last_name: string;
  photo_url?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  skills?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface UpdateContactRequest {
  phone_number: string;
  email: string;
  address: string;
}

export interface ProfileHistory {
  id: number;
  user_id?: number;
  field_changed: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
}

export interface AlertMessage {
  message: string;
  type: 'success' | 'error';
}

