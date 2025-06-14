import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useDiscussionComments(threadId: string, initialComments: any[] = []) {
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('discussion_comments')
        .select(`
          *,
          profiles!user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const createComment = async (content: string) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('discussion_comments')
        .insert({
          thread_id: threadId,
          user_id: user.id,
          content,
        })
        .select(`
          *,
          profiles!user_id (
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Add the new comment to the list
      setComments(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we don't have initial comments
    if (initialComments.length === 0) {
      fetchComments();
    }
  }, [threadId]);

  return {
    comments,
    loading,
    createComment,
    refetch: fetchComments,
  };
}