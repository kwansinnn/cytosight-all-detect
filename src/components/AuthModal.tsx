import { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
  
  useEffect(() => {
    setCurrentView(view);
  }, [view]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        onOpenChange(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const interceptFormSubmission = () => {
      const authContainer = document.querySelector('[data-supabase-auth-ui]');
      if (!authContainer) return;

      const form = authContainer.querySelector('form');
      if (!form) return;

      const handleSubmit = (e: Event) => {
        const formData = new FormData(form);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
          e.preventDefault();
          toast({
            title: "Missing Information",
            description: "Please enter both email and password",
            variant: "destructive",
          });
        }
      };

      form.addEventListener('submit', handleSubmit);
      return () => form.removeEventListener('submit', handleSubmit);
    };

    // Wait for the Auth component to render
    const timeout = setTimeout(interceptFormSubmission, 100);
    return () => clearTimeout(timeout);
  }, [open, currentView, toast]);

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