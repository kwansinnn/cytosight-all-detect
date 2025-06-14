import { useAuth } from '@/contexts/AuthContext';
import { useUploads } from '@/hooks/useUploads';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import UploadSection from '@/components/dashboard/UploadSection';
import AnalysisHistory from '@/components/dashboard/AnalysisHistory';

const Dashboard = () => {
  const { user } = useAuth();
  const { uploads, loading, addUpload } = useUploads();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />
        <UploadSection onUploadComplete={addUpload} />
        <AnalysisHistory uploads={uploads} />
      </div>
    </div>
  );
};

export default Dashboard;