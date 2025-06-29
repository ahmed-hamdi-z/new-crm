import { baseURL } from "@/lib/base-url";

type SocialProvider = 'google' | 'github' | 'facebook' | 'twitter';

export const getSocialAuthUrl = (provider: SocialProvider): string => {
  return `${baseURL}/api/auth/${provider}`;
};

export const initiateSocialAuth = (provider: SocialProvider) => {
  window.location.href = getSocialAuthUrl(provider);
};

export const handleSocialAuthResponse = (response: any) => {
  console.log('Social auth success:', response);
};

export const handleSocialAuthError = (error: any) => {
  console.error('Social auth error:', error);
  return {
    message: error.message || 'Social authentication failed. Please try again.'
  };
};