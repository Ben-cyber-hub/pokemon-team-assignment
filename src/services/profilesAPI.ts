import { supabase } from '../lib/supabase';
import { Profile } from '../types/auth.types';

export const profilesAPI = {
  async createProfile(userId: string, email: string): Promise<Profile> {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select()
      .eq('user_id', userId)
      .single();

    if (existingProfile) {
      return existingProfile as Profile;
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        username: email.split('@')[0], // Create username from email
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (error) {
      console.error('Profile creation error:', error);
      throw new Error('Failed to create user profile');
    }

    return {
      ...data,
      email, // Add email from auth, since it's not stored in profiles table
    } as Profile;
  }
};

export default profilesAPI;