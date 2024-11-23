// AuthNavigatorContext.tsx
import React, { createContext, useContext, useState } from "react";

interface AuthNavigationState {
  currentPage: string;
  navigate: (page: string) => void;
}

const defaultAuthNavigationData: AuthNavigationState = {
  currentPage: "login",
  navigate: () => {},
};

export const AuthNavigatorContext = createContext<AuthNavigationState>(
  defaultAuthNavigationData
);

export const useAuthNavigator = () => useContext(AuthNavigatorContext);

export const AuthNavigatorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentPage, setCurrentPage] = useState(
    defaultAuthNavigationData.currentPage
  );

  const navigate = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <AuthNavigatorContext.Provider value={{ currentPage, navigate }}>
      {children}
    </AuthNavigatorContext.Provider>
  );
};
