import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Microscope, Menu, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/2bfd87c8-402f-4b8f-9ba3-2656c8e4ec9b.png" 
                  alt="CytoSight Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-foreground">CytoSight</h1>
            </div>
          </div>
          
          {user && (
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Analysis
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Discussions
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Reports
              </a>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setAuthModalOpen(true)}
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setAuthModalOpen(true)}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
      />
    </>
  );
};

export default Header;