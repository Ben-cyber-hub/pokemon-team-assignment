import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

export interface Profile extends User {
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Helper function to convert Supabase User to our User type
export const mapSupabaseUser = (user: SupabaseUser | null): User | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email ?? '',
    username: user.email?.split('@')[0] ?? '',
    created_at: user.created_at
  };
};