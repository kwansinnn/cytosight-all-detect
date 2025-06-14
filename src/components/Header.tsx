import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Microscope, Menu, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error: any) {
      toast.error('Error signing out');
    }
  };

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="p-2 bg-primary rounded-lg">
                <Microscope className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">CytoSight</h1>
            </div>
          </div>
          
          {user && (
            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/history')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                History
              </button>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden md:block">
                  {user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setAuthModalOpen(true)}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => setAuthModalOpen(true)}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};

export default Header;