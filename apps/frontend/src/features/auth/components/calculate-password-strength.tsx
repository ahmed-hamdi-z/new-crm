import { PasswordStrength } from "../types";

  export const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return PasswordStrength.WEAK;
    
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score < 3) return PasswordStrength.WEAK;
    if (score < 5) return PasswordStrength.MEDIUM;
    if (score < 6) return PasswordStrength.STRONG;
    return PasswordStrength.VERY_STRONG;
  };
  