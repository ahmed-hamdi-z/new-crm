import React, { memo } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { initiateSocialAuth } from "../hooks/useSocialAuth";

type SocialProvider = "google" | "github" | "facebook" | "twitter";
type AuthAction = "login" | "register";

interface SocialAuthButtonProps extends Omit<ButtonProps, "children"> {
  provider: SocialProvider;
  action: AuthAction;
  icon: React.ReactNode;
  isLoading?: boolean;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const providerNames = {
  google: "Google",
  github: "GitHub",
  facebook: "Facebook",
  twitter: "Twitter",
};

export const SocialAuthButton: React.FC<SocialAuthButtonProps> = memo(
  ({
    provider,
    action,
    icon,
    isLoading = false,
    onSuccess, 
    onError,
    ...props
  }) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (isLoading) return;

      try {
        initiateSocialAuth(provider);
        onSuccess?.({ provider, action });
      } catch (error) {
        console.error(`Social auth error with ${provider}:`, error);
        onError?.({
          message: `Failed to authenticate with ${provider}. Please try again.`,
        });
      }
    };
    const buttonText = `${action === "register" ? "Sign up" : "Log in"} with ${providerNames[provider]}`;

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
  }
);

SocialAuthButton.displayName = "SocialAuthButton";
