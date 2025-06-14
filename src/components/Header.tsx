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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {user ? (
                    <>
                      <a href="/dashboard" className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent">
                        Dashboard
                      </a>
                      <a href="#" className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent">
                        Analysis
                      </a>
                      <a href="/collaboration" className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent">
                        Collaboration
                      </a>
                      <a href="#" className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent">
                        Reports
                      </a>
                      <a href="#" className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent">
                        History
                      </a>
                    </>
                  ) : (
                    <>
                      <a href="#" className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent">
                        About
                      </a>
                      <a href="#" className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent">
                        Contact
                      </a>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => window.location.href = '/'}
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/a52e9727-e953-466a-bcf3-6c44855a2876.png" 
                  alt="CytoSight Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CytoSight</h1>
                <p className="text-xs text-muted-foreground">Cell Analysis Platform</p>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <a href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Analysis
                </a>
                <a href="/collaboration" className="text-muted-foreground hover:text-foreground transition-colors">
                  Collaboration
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Reports
                </a>
              </>
            ) : (
              <>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </>
            )}
          </nav>

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