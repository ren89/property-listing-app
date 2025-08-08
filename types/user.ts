export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  id: string;
  email: string;
  role: string;
  name: string;
  avatar_url?: string;
}
