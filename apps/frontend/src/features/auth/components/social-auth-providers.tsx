import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaFacebook, FaTwitter } from 'react-icons/fa';
import { SocialAuthButton } from './social-auth-button';

type AuthAction = 'login' | 'register';

interface SocialAuthProvidersProps {
  action: AuthAction;
  isLoading?: boolean;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  providers?: Array<'google' | 'github' | 'facebook' | 'twitter'>;
}

const providerIcons = {
  google: <FcGoogle className="size-5" />,
  github: <FaGithub className="size-5" />,
  facebook: <FaFacebook className="size-5 text-blue-600" />,
  twitter: <FaTwitter className="size-5 text-blue-400" />
};

export const SocialAuthProviders: React.FC<SocialAuthProvidersProps> = ({
  action,
  isLoading = false,
  onSuccess,
  onError,
  providers = ['google', 'github', 'facebook', 'twitter']
}) => {
  return (
    <div className="flex flex-col gap-y-4">
      {providers.map((provider) => (
        <SocialAuthButton
          key={provider}
          provider={provider}
          action={action}
          icon={providerIcons[provider]}
          isLoading={isLoading}
          onSuccess={onSuccess}
          onError={onError}
        />
      ))}
    </div>
  );
};