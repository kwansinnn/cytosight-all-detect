import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { CreateThreadDialog } from '@/components/discussion/CreateThreadDialog';
import { DiscussionThread } from '@/components/discussion/DiscussionThread';
import { useDiscussionThreads } from '@/hooks/useDiscussionThreads';
import { useFocusThreads } from '@/hooks/useFocusThreads';

const Collaboration = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { threads, loading, createThread } = useDiscussionThreads();
  const { focusThreads, loading: focusLoading } = useFocusThreads();

  const handleCreateThread = async (data: any) => {
    await createThread(data);
    setShowCreateDialog(false);
  };

  const handleDeleteThread = () => {
    // Refetch threads to update the list after deletion
    window.location.reload();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading collaborations...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Team Collaboration</h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Share case insights, discuss analysis results, and collaborate with your team
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Collaboration
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Collaborations</TabsTrigger>
            <TabsTrigger value="focus">My Focus</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-6">
              {threads.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No collaborations yet</p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    Start the first collaboration
                  </Button>
                </div>
              ) : (
                threads.map((thread) => (
                  <DiscussionThread key={thread.id} thread={thread} onDelete={handleDeleteThread} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="focus" className="mt-6">
            <div className="space-y-6">
              {focusLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading focus...</p>
                </div>
              ) : focusThreads.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No focus collaborations yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Star collaborations to add them to your focus
                  </p>
                </div>
              ) : (
                focusThreads.map((thread) => (
                  <DiscussionThread key={thread.id} thread={thread} onDelete={handleDeleteThread} />
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

export default Collaboration;