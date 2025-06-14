import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useFavoriteToggle(threadId: string) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkFavoriteStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('discussion_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('thread_id', threadId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setIsFavorited(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to favorite discussions",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('discussion_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('thread_id', threadId);

        if (error) throw error;
        setIsFavorited(false);
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('discussion_favorites')
          .insert({
            user_id: user.id,
            thread_id: threadId,
          });

        if (error) throw error;
        setIsFavorited(true);
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkFavoriteStatus();
  }, [user, threadId]);

  return {
    isFavorited,
    loading,
    toggleFavorite,
  };
}