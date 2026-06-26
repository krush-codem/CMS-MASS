import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export function useAdminAuth() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser(user);
          // Fetch role from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
          setRole(profile?.role || 'user');
        }
      } catch (error) {
        console.error('Error fetching user auth status:', error);
      } finally {
        setLoading(false);
      }
    }

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          setUser(null);
          setRole(null);
        } else {
          checkUser();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, role, loading, isAdmin: role === 'admin' };
}
