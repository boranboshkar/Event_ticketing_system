// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getUserProfile } from '../services/authServices';

interface UserDetails {
  _id: string;
  username: string;
  token: string;
  permission: string;
}

interface AuthContextData {
  isAuthenticated: boolean;
  userDetails: UserDetails | null;
  setUserDetails: (userDetails: UserDetails | null) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  isLoading: boolean;
  logout: () => void; 
}

const defaultAuthData: AuthContextData = {
  isAuthenticated: false,
  userDetails: null,
  setUserDetails: () => {},
  setIsAuthenticated: () => {},
  isLoading: true,
  logout: () => {}, 
};

export const AuthContext = createContext<AuthContextData>(defaultAuthData);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(defaultAuthData.isAuthenticated);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(defaultAuthData.userDetails);
  const [isLoading, setIsLoading] = useState(defaultAuthData.isLoading);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const userDetails = await getUserProfile()
          setIsAuthenticated(true);
          setUserDetails(userDetails);
        } catch (error) {
          setIsAuthenticated(false);
          setUserDetails(null);
          console.error("Authentication check failed:", error);
        }
      } else {
        setIsAuthenticated(false);
        setUserDetails(null);
      }
      setIsLoading(false);
    };

    checkAuthentication();
  }, []);
  const logout = () => {
    Cookies.remove('token'); // Remove the token during logout
    setIsAuthenticated(false);
    setUserDetails(null); // Clear userDetails
    //TODO: calle the logout endpoint to the backend.
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userDetails, setUserDetails, setIsAuthenticated, isLoading,logout }}>
      {children}
    </AuthContext.Provider>
  );
};

