import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useFocusToggle(threadId: string) {
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkFocusStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('discussion_focus')
        .select('id')
        .eq('user_id', user.id)
        .eq('thread_id', threadId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setIsFocused(!!data);
    } catch (error) {
      console.error('Error checking focus status:', error);
    }
  };

  const toggleFocus = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to focus on collaborations",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isFocused) {
        // Remove from focus
        const { error } = await supabase
          .from('discussion_focus')
          .delete()
          .eq('user_id', user.id)
          .eq('thread_id', threadId);

        if (error) throw error;
        setIsFocused(false);
      } else {
        // Add to focus
        const { error } = await supabase
          .from('discussion_focus')
          .insert({
            user_id: user.id,
            thread_id: threadId,
          });

        if (error) throw error;
        setIsFocused(true);
      }
    } catch (error: any) {
      console.error('Error toggling focus:', error);
      toast({
        title: "Error",
        description: "Failed to update focus status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkFocusStatus();
  }, [user, threadId]);

  return {
    isFocused,
    loading,
    toggleFocus,
  };
}