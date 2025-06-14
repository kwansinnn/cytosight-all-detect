import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useFocusThreads() {
  const [focusThreads, setFocusThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFocusThreads = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('discussion_focus')
        .select(`
          discussion_threads (
            *,
            profiles!user_id (
              full_name,
              avatar_url
            ),
            discussion_comments (
              id,
              content,
              created_at,
              user_id,
              profiles!user_id (
                full_name,
                avatar_url
              )
            ),
            discussion_focus (
              user_id
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Extract the thread data from the nested structure
      const threads = data?.map(item => item.discussion_threads).filter(Boolean) || [];
      setFocusThreads(threads);
    } catch (error) {
      console.error('Error fetching focus threads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFocusThreads();
  }, [user]);

  return {
    focusThreads,
    loading,
    refetch: fetchFocusThreads,
  };
}