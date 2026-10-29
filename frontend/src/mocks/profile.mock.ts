import { UserProfile, ProfileHistory } from '../types';

export const MOCK_PROFILE: UserProfile = {
  id: 1,
  full_name: 'Siraphop',
  last_name: 'Chootong',
  photo_url: '',
  phone_number: '081-234-5678',
  email: 'john.doe@example.com',
  address: '123 Sukhumvit Road, Bangkok, Thailand',
  skills: ['Go', 'React'],
};

export const MOCK_SKILLS: string[] = [
  'Go',
  'React',
  'Flutter',
  'CI/CD',
  'PostgreSQL',
  'Docker',
  'Kubernetes',
  'TypeScript',
];

export const MOCK_HISTORIES: ProfileHistory[] = [
  {
    id: 1,
    user_id: 1,
    field_changed: 'skills',
    old_value: '["Go"]',
    new_value: '["Go", "React"]',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    field_changed: 'phone_number',
    old_value: '089-999-9999',
    new_value: '081-234-5678',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

