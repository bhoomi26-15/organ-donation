import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, user?: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Create profile stub if not created yet (common for OAuth first login)
        if (error.code === 'PGRST116' || error.message?.includes('No row')) {
          const full_name = user?.user_metadata?.full_name || user?.email || null;
          const email = user?.email || null;
          const role = (user?.user_metadata as any)?.role || null;

          const { data: upserted, error: upsertError } = await supabase
            .from('profiles')
            .upsert(
              {
                id: userId,
                full_name,
                email,
                role,
                profile_completed: false,
              },
              { onConflict: 'id' }
            )
            .select()
            .single();

          if (upsertError) {
            console.error('Error upserting profile:', upsertError);
            setProfile(null);
          } else {
            setProfile(upserted as Profile);
          }
        } else {
          console.error('Error fetching profile:', error);
          setProfile(null);
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user);
    }
  };

  useEffect(() => {
    // Check and handle OAuth callback
    const handleOAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      }

      // Try to get hash for OAuth redirect handling
      const hash = window.location.hash;
      if (hash.includes('access_token')) {
        // Session will be restored automatically by Supabase SDK
        setTimeout(() => {
          window.location.hash = '';
        }, 100);
      }

      return data?.session;
    };

    const initializeAuth = async () => {
      // Get initial session (either existing or restored from OAuth callback)
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting initial session:', error);
      }

      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        await fetchProfile(initialSession.user.id, initialSession.user);
      }

      setLoading(false);
    };

    // Try to handle OAuth callback first
    handleOAuthCallback().then(() => {
      initializeAuth();
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id, session.user);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();

    // Force local state cleanup
    setSession(null);
    setUser(null);
    setProfile(null);

    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
