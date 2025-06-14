import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const handleAuthModalClose = (open: boolean) => {
    setShowAuthModal(open);
    if (!open) {
      navigate('/');
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    } else if (user) {
      setShowAuthModal(false);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-4">
              Please sign in to access this page
            </p>
          </div>
        </div>
        <AuthModal 
          open={showAuthModal} 
          onOpenChange={handleAuthModalClose}
        />
      </>
    );
  }

  return <>{children}</>;
}