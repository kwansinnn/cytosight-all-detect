import { useAuth } from '@/contexts/AuthContext';

const DashboardHeader = () => {
  const { user, profile } = useAuth();

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Welcome back, {profile?.full_name || user?.email}
      </h1>
      <p className="text-muted-foreground">
        Upload and analyze your cell images with AI-powered precision
      </p>
    </div>
  );
};

export default DashboardHeader;