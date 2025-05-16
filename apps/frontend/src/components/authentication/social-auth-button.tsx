import React, { useCallback, memo } from 'react';
import { Button, ButtonProps } from "@/components/ui/button";

interface SocialAuthButtonProps extends Omit<ButtonProps, 'children'> {
  provider: 'google' | 'github' | 'facebook' | 'twitter';
  action: 'login' | 'register';
  icon: React.ReactNode;
  isLoading?: boolean;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

/**
 * A reusable button component for social authentication (login or registration)
 * 
 * @param provider - The social auth provider ('google', 'github', etc.)
 * @param action - The authentication action ('login' or 'register')
 * @param icon - The icon component to display
 * @param isLoading - Whether the button is in a loading state
 * @param onSuccess - Callback function when auth succeeds
 * @param onError - Callback function when auth fails
 * @returns A styled button for social authentication
 */
export const SocialAuthButton: React.FC<SocialAuthButtonProps> = memo(({
  provider,
  action,
  icon,
  isLoading = false,
  onSuccess,
  onError,
  ...props
}) => {
  const handleClick = useCallback(async (_e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading) return;
    
    try {
      // Here you would implement the actual social auth logic
      // This logic might differ slightly based on the 'action' prop
      console.log(`${action === 'register' ? 'Registering' : 'Logging in'} with ${provider}`);
      
      // Mock successful auth
      if (onSuccess) {
        onSuccess({ provider, action, success: true });
      }
    } catch (error) {
      console.error(`Error ${action === 'register' ? 'registering' : 'logging in'} with ${provider}:`, error);
      if (onError) {
        onError(error);
      }
    }
  }, [isLoading, provider, action, onSuccess, onError]);

  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
  const buttonText = action === 'register' ? `Sign up with ${providerName}` : `Login with ${providerName}`;

  return (
    <Button
      className="w-full"
      variant="secondary"
      size="lg"
      disabled={isLoading}
      onClick={handleClick}
      aria-label={buttonText}
      {...props}
    >
      {icon}
      <span className="ml-2">{buttonText}</span>
    </Button>
  );
});

SocialAuthButton.displayName = 'SocialAuthButton';

export default SocialAuthButton;
