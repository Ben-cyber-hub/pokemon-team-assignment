import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { User, mapSupabaseUser } from '../types/auth.types';
import { supabase } from '../lib/supabase';
import { validateEmail, validatePassword } from '../utils/validation';

/**
 * Custom error class for authentication errors
 */
export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

// Create and export the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export const AuthProvider = ({ children, initialUser }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session ? mapSupabaseUser(session.user) : null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (mounted) {
          setUser(session ? mapSupabaseUser(session.user) : null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      if (!validateEmail(email)) {
        throw new AuthError('Invalid email format');
      }
      if (!validatePassword(password)) {
        throw new AuthError(
          'Password must be at least 8 characters and contain at least one letter and one number'
        );
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/pokemon-team-assignment/login`,
          data: {
            created_at: new Date().toISOString(),
          }
        }
      });

      if (error) throw new AuthError(error.message, error.name);
      
      return { 
        needsEmailConfirmation: !data.user?.confirmed_at
      };
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new AuthError('Failed to sign up. Please try again.');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw new AuthError(error.message, error.name);
      if (!data.user) throw new AuthError('No user returned after sign in');
      
      setUser(mapSupabaseUser(data.user));
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new AuthError('Failed to sign in. Please try again.');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new AuthError(error.message, error.name);
      setUser(null);
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new AuthError('Failed to sign out. Please try again.');
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}