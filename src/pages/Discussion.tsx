import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { CreateThreadDialog } from '@/components/discussion/CreateThreadDialog';
import { DiscussionThread } from '@/components/discussion/DiscussionThread';
import { useDiscussionThreads } from '@/hooks/useDiscussionThreads';
import { useFavoriteThreads } from '@/hooks/useFavoriteThreads';

const Discussion = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { threads, loading, createThread } = useDiscussionThreads();
  const { favoriteThreads, loading: favoritesLoading } = useFavoriteThreads();

  const handleCreateThread = async (data: any) => {
    await createThread(data);
    setShowCreateDialog(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading discussions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Discussion Forum</h1>
            <p className="text-muted-foreground mt-2">
              Share insights, ask questions, and collaborate with the community
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Discussion
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Discussions</TabsTrigger>
            <TabsTrigger value="favorites">My Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-6">
              {threads.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No discussions yet</p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    Start the first discussion
                  </Button>
                </div>
              ) : (
                threads.map((thread) => (
                  <DiscussionThread key={thread.id} thread={thread} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <div className="space-y-6">
              {favoritesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading favorites...</p>
                </div>
              ) : favoriteThreads.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No favorite discussions yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Star discussions to add them to your favorites
                  </p>
                </div>
              ) : (
                favoriteThreads.map((thread) => (
                  <DiscussionThread key={thread.id} thread={thread} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <CreateThreadDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreateThread}
        />
      </div>
    </DashboardLayout>
  );
};

export default Discussion;