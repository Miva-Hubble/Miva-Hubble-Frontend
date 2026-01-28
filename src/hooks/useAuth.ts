import { useState, useEffect } from 'react';

// Mock auth hook for starter code
export const useAuth = () => {
  // Simulating a user for development purposes
  // Set to null to test redirection to login
  const [user, setUser] = useState<{ name: string } | null>({ name: "Dev User" }); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const login = () => setUser({ name: "Dev User" });
  const logout = () => setUser(null);

  return { user, isLoading, login, logout };
};
