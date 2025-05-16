import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { CardContent } from "@/components/ui/card";
import {  AlertTitle, AlertDescription } from "@/components/ui/alert";

/**
 * Renders the loading state for the email verification card.
 * 
 * @returns A JSX element representing the loading state.
 */
export const LoadingState: React.FC = () => (
  <CardContent className="p-7 flex flex-col items-center justify-center min-h-[200px]">
    <FaSpinner className="w-10 h-10 text-blue-500 animate-spin mb-4" aria-hidden="true" />
    <AlertTitle className="text-lg font-semibold mb-2">Verifying Email...</AlertTitle>
    <AlertDescription className="text-gray-600 text-center">
      Please wait while we verify your email address.
    </AlertDescription>
  </CardContent>
);

