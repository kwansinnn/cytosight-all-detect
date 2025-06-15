import { useState, useEffect, useRef, useCallback } from 'react';
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
  const observerRef = useRef<MutationObserver | null>(null);
  const cleanupFunctionsRef = useRef<(() => void)[]>([]);

  // Cleanup function to remove all listeners and observers
  const cleanup = useCallback(() => {
    cleanupFunctionsRef.current.forEach(fn => fn());
    cleanupFunctionsRef.current = [];
    
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // Validate form inputs
  const validateInputs = useCallback((form: HTMLFormElement) => {
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
    const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;
    
    const email = emailInput?.value?.trim() || '';
    const password = passwordInput?.value?.trim() || '';
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  }, [toast]);

  // Add form validation with retry mechanism
  const setupFormValidation = useCallback((retryCount = 0) => {
    const maxRetries = 5;
    const retryDelay = Math.pow(2, retryCount) * 100; // Exponential backoff
    
    const authContainer = document.querySelector('[data-supabase-auth-ui]');
    if (!authContainer) {
      if (retryCount < maxRetries) {
        const timeoutId = setTimeout(() => setupFormValidation(retryCount + 1), retryDelay);
        cleanupFunctionsRef.current.push(() => clearTimeout(timeoutId));
      }
      return;
    }

    const form = authContainer.querySelector('form') as HTMLFormElement;
    if (!form) {
      if (retryCount < maxRetries) {
        const timeoutId = setTimeout(() => setupFormValidation(retryCount + 1), retryDelay);
        cleanupFunctionsRef.current.push(() => clearTimeout(timeoutId));
      }
      return;
    }

    // Form submission validation
    const handleSubmit = (e: Event) => {
      if (!validateInputs(form)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Real-time input validation
    const handleInputChange = () => {
      const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;
      
      // Clear any existing error states when user starts typing
      if (emailInput?.value?.trim() && passwordInput?.value?.trim()) {
        // Remove any error styling if both fields have content
        emailInput.style.borderColor = '';
        passwordInput.style.borderColor = '';
      }
    };

    // Add event listeners
    form.addEventListener('submit', handleSubmit, { capture: true });
    
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"]');
    
    if (emailInput) {
      emailInput.addEventListener('input', handleInputChange);
      cleanupFunctionsRef.current.push(() => emailInput.removeEventListener('input', handleInputChange));
    }
    
    if (passwordInput) {
      passwordInput.addEventListener('input', handleInputChange);
      cleanupFunctionsRef.current.push(() => passwordInput.removeEventListener('input', handleInputChange));
    }

    // Store cleanup function
    cleanupFunctionsRef.current.push(() => {
      form.removeEventListener('submit', handleSubmit, { capture: true });
    });
  }, [validateInputs]);

  // Set up MutationObserver to detect when Auth UI renders
  const setupAuthObserver = useCallback(() => {
    if (!open) return;

    const targetNode = document.body;
    
    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // Check if Auth UI was added
              if (element.querySelector?.('[data-supabase-auth-ui]') || 
                  element.matches?.('[data-supabase-auth-ui]')) {
                setupFormValidation();
              }
            }
          });
        }
      });
    });

    observerRef.current.observe(targetNode, {
      childList: true,
      subtree: true
    });

    // Also try immediate setup in case the form is already there
    setTimeout(() => setupFormValidation(), 50);
  }, [open, setupFormValidation]);

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

  // Listen for auth errors and replace Supabase messages with custom ones
  useEffect(() => {
    if (!open) return;

    let originalSignInWithPassword: typeof supabase.auth.signInWithPassword;
    let originalSignUp: typeof supabase.auth.signUp;

    const setupAuthErrorHandling = () => {
      // Store original methods
      originalSignInWithPassword = supabase.auth.signInWithPassword;
      originalSignUp = supabase.auth.signUp;

      // Override signInWithPassword to catch validation errors
      supabase.auth.signInWithPassword = async (credentials) => {
        const result = await originalSignInWithPassword.call(supabase.auth, credentials);
        if (result.error && (
          result.error.message.includes('missing email or phone') ||
          result.error.message.includes('Invalid login credentials') ||
          result.error.message.includes('Email not confirmed')
        )) {
          toast({
            title: "Missing Information",
            description: "Please enter both email and password",
            variant: "destructive",
          });
          return { data: result.data, error: null }; // Suppress original error
        }
        return result;
      };

      // Override signUp to catch validation errors
      supabase.auth.signUp = async (credentials) => {
        const result = await originalSignUp.call(supabase.auth, credentials);
        if (result.error && result.error.message.includes('missing email or phone')) {
          toast({
            title: "Missing Information", 
            description: "Please enter both email and password",
            variant: "destructive",
          });
          return { data: result.data, error: null }; // Suppress original error
        }
        return result;
      };
    };

    setupAuthErrorHandling();

    // Cleanup function to restore original methods
    return () => {
      if (originalSignInWithPassword) {
        supabase.auth.signInWithPassword = originalSignInWithPassword;
      }
      if (originalSignUp) {
        supabase.auth.signUp = originalSignUp;
      }
    };
  }, [open, toast]);

  useEffect(() => {
    if (open) {
      setupAuthObserver();
    } else {
      cleanup();
    }

    return cleanup;
  }, [open, currentView, setupAuthObserver, cleanup]);

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
                link_text: "",
              },
              sign_up: {
                link_text: "",
              },
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;