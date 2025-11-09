import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'moderator' | 'user';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRole(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Fetch user's roles from user_roles table
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('user'); // Default to user role
          setIsAdmin(false);
        } else if (roles && roles.length > 0) {
          // Check if user has admin role
          const hasAdminRole = roles.some(r => r.role === 'admin');
          setIsAdmin(hasAdminRole);
          
          // Set highest role (admin > moderator > user)
          if (hasAdminRole) {
            setRole('admin');
          } else if (roles.some(r => r.role === 'moderator')) {
            setRole('moderator');
          } else {
            setRole('user');
          }
        } else {
          // No roles assigned, default to user
          setRole('user');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error in useUserRole:', error);
        setRole('user');
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();

    // Set up realtime subscription for role changes
    const channel = supabase
      .channel('user-roles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles'
        },
        () => {
          fetchUserRole();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { role, isAdmin, loading };
};
