import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'reviewer' | 'editor' | 'viewer';

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
          setRole('editor'); // Default to editor role
          setIsAdmin(false);
        } else if (roles && roles.length > 0) {
          // Determine role priority: admin > reviewer > editor > viewer
          const hasAdminRole = roles.some((r: any) => r.role === 'admin');
          const hasReviewerRole = roles.some((r: any) => r.role === 'reviewer');
          const hasEditorRole = roles.some((r: any) => r.role === 'editor');
          setIsAdmin(hasAdminRole);

          if (hasAdminRole) {
            setRole('admin');
          } else if (hasReviewerRole) {
            setRole('reviewer');
          } else if (hasEditorRole) {
            setRole('editor');
          } else {
            setRole('viewer');
          }
        } else {
          // No roles assigned, default to editor
          setRole('editor');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error in useUserRole:', error);
        setRole('editor');
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();

    // Set up realtime subscription for role changes with unique channel name
    const channelName = `user-roles-changes-${(typeof crypto !== 'undefined' && 'randomUUID' in crypto) ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`;
    const channel = supabase.channel(channelName);

    channel
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
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  return { role, isAdmin, loading };
};
