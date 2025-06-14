import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useDiscussionThreads() {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchThreads = async () => {
    try {
      const { data, error } = await supabase
        .from('discussion_threads')
        .select(`
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
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setThreads(data || []);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const createThread = async (threadData: {
    title: string;
    content: string;
    image_url?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('discussion_threads')
      .insert({
        ...threadData,
        user_id: user.id,
      })
      .select(`
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
      `)
      .single();

    if (error) throw error;

    // Add the new thread to the beginning of the list
    setThreads(prev => [data, ...prev]);
    return data;
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  return {
    threads,
    loading,
    createThread,
    refetch: fetchThreads,
  };
}