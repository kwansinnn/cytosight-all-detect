import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useDiscussionComments } from '@/hooks/useDiscussionComments';

interface DiscussionCommentsProps {
  threadId: string;
  comments: Array<{
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles?: {
      full_name?: string;
      avatar_url?: string;
    };
  }>;
}

export function DiscussionComments({ threadId, comments: initialComments }: DiscussionCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const { comments, createComment, loading } = useDiscussionComments(threadId, initialComments);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await createComment(newComment.trim());
    setNewComment('');
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="space-y-3">
        {comments.map((comment) => (
          <Card key={comment.id} className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.profiles?.avatar_url || ''} />
                  <AvatarFallback className="text-xs">
                    {getInitials(comment.profiles?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                    <User className="h-3 w-3" />
                    <span className="font-medium">
                      {comment.profiles?.full_name || 'Unknown User'}
                    </span>
                    <Calendar className="h-3 w-3 ml-2" />
                    <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {user && (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            disabled={loading}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={loading || !newComment.trim()}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}