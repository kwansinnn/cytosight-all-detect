import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, MessageCircle, Calendar, User, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useFocusToggle } from '@/hooks/useFocusToggle';
import { DiscussionComments } from './DiscussionComments';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DiscussionThreadProps {
  thread: {
    id: string;
    title: string;
    content: string;
    image_url?: string;
    created_at: string;
    user_id: string;
    profiles?: {
      full_name?: string;
      avatar_url?: string;
    };
    discussion_comments?: Array<{
      id: string;
      content: string;
      created_at: string;
      user_id: string;
      profiles?: {
        full_name?: string;
        avatar_url?: string;
      };
    }>;
    discussion_focus?: Array<{
      user_id: string;
    }>;
  };
  onDelete?: () => void;
}

export function DiscussionThread({ thread, onDelete }: DiscussionThreadProps) {
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const { isFocused, toggleFocus } = useFocusToggle(thread.id);
  const { toast } = useToast();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDelete = async () => {
    if (!user || user.id !== thread.user_id) {
      toast({
        title: "Not Authorized",
        description: "You can only delete your own collaborations",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('discussion_threads')
        .delete()
        .eq('id', thread.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Collaboration Deleted",
        description: "The collaboration has been successfully deleted",
      });

      onDelete?.();
    } catch (error: any) {
      console.error('Error deleting thread:', error);
      toast({
        title: "Error",
        description: "Failed to delete collaboration",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const commentCount = thread.discussion_comments?.length || 0;
  const focusCount = thread.discussion_focus?.length || 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={thread.profiles?.avatar_url || ''} />
              <AvatarFallback>
                {getInitials(thread.profiles?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{thread.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{thread.profiles?.full_name || 'Unknown User'}</span>
                <Calendar className="h-3 w-3 ml-2" />
                <span>{formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {focusCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {focusCount} {focusCount === 1 ? 'star' : 'stars'}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFocus}
              className={isFocused ? 'text-yellow-500' : ''}
            >
              <Star className={`h-4 w-4 ${isFocused ? 'fill-current' : ''}`} />
            </Button>
            {user && user.id === thread.user_id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground whitespace-pre-wrap">{thread.content}</p>
        </div>

        {thread.image_url && (
          <div className="rounded-lg overflow-hidden border">
            <img
              src={thread.image_url}
              alt="Discussion attachment"
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
          </Button>
        </div>

        {showComments && (
          <DiscussionComments
            threadId={thread.id}
            comments={thread.discussion_comments || []}
          />
        )}
      </CardContent>
    </Card>
  );
}