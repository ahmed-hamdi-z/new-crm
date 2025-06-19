import { useState, useCallback } from 'react';

export const usePasswordVisibility = (initialState = false) => {
  const [showPassword, setShowPassword] = useState(initialState);
  
  const toggleVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return {
    showPassword,
    toggleVisibility
  };
}; 