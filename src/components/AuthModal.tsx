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
  const isSignUp = view === 'sign_up';
  
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
          view={view}
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
        />
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;