import { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  view?: 'sign_in' | 'sign_up';
}

const AuthModal = ({ open, onOpenChange, view = 'sign_in' }: AuthModalProps) => {
  const [currentView, setCurrentView] = useState<'sign_in' | 'sign_up'>(view);
  
  useEffect(() => {
    setCurrentView(view);
  }, [view]);

  const isSignUp = currentView === 'sign_up';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isSignUp ? 'Sign up to CytoSight' : 'Sign in to CytoSight'}</DialogTitle>
          <DialogDescription>
            {isSignUp ? 'Create your account to start analyzing cell images' : 'Access your personalized cell analysis dashboard'}
          </DialogDescription>
        </DialogHeader>
        <Auth
          supabaseClient={supabase}
          view={currentView}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary))',
                }
              }
            }
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/`}
          localization={{
            variables: {
              sign_in: {
                link_text: "Don't have an account? Sign up",
              },
              sign_up: {
                link_text: "Already have an account? Sign in",
              },
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;