import { useAuth } from '@/contexts/AuthContext';
import { useUploads } from '@/hooks/useUploads';
import { DashboardLayout } from '@/components/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import UploadSection from '@/components/dashboard/UploadSection';
import AnalysisHistory from '@/components/dashboard/AnalysisHistory';

const Dashboard = () => {
  const { user } = useAuth();
  const { uploads, loading, addUpload } = useUploads();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />
        <UploadSection onUploadComplete={addUpload} />
        <AnalysisHistory uploads={uploads} />
        
        {/* Emergency Support */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Emergency Support</h2>
            <p className="text-muted-foreground mb-6">
              For critical system issues affecting patient care, contact our emergency support line immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+1-800-CYTO-911"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 h-10 px-4 py-2"
              >
                Emergency: +1 (800) CYTO-911
              </a>
              <span className="text-muted-foreground text-sm self-center">
                Available 24/7 for critical issues
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;