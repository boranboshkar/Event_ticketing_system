import React, { createContext, useContext, useState, useEffect } from "react";

interface BackofficeNavigationState {
  page: string;
  data?: any;
}

interface BackofficeNavigatorContextData {
  currentPage: string;
  navigate: (page: string, data?: any) => void;
  goBack: () => void;
  historyStack: BackofficeNavigationState[];
  selectedEventId: string | null;
  resetNavigator: () => void;
}

const defaultBackofficeNavigationData: BackofficeNavigatorContextData = {
  currentPage: "dashboard",
  navigate: () => {},
  goBack: () => {},
  historyStack: [],
  selectedEventId: null,
  resetNavigator: () => {},
};

export const BackofficeNavigatorContext =
  createContext<BackofficeNavigatorContextData>(
    defaultBackofficeNavigationData
  );

export const useBackofficeNavigator = () =>
  useContext(BackofficeNavigatorContext);

export const BackofficeNavigatorProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const savedState =
    JSON.parse(sessionStorage.getItem("backofficeNavigatorState") || "null") ||
    defaultBackofficeNavigationData;
  const [currentPage, setCurrentPage] = useState(savedState.currentPage);
  const [historyStack, setHistoryStack] = useState<BackofficeNavigationState[]>(
    savedState.historyStack
  );
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    savedState.selectedEventId
  );

  useEffect(() => {
    sessionStorage.setItem(
      "backofficeNavigatorState",
      JSON.stringify({ currentPage, historyStack, selectedEventId })
    );
  }, [currentPage, historyStack, selectedEventId]);

  useEffect(() => {
    const savedState = JSON.parse(
      sessionStorage.getItem("backofficeNavigatorState") || "null"
    );
    if (savedState) {
      setCurrentPage(savedState.currentPage);
      setHistoryStack(savedState.historyStack);
    }
  }, []);

  // const updateSessionStorage = () => {
  //   const state = {
  //     currentPage,
  //     selectedEventId,
  //     historyStack,
  //   };
  //   sessionStorage.setItem('navigatorState', JSON.stringify(state));
  // };

  const navigate = (page: string, data?: any) => {
    // Your custom logic for handling specific page navigation can go here
    // const newPageNavigation = { page, data };
    if (page === "evetnDetails" && data?.eventId) {
      setSelectedEventId(data.eventId);
    }

    if (page === "dashboard" || page === "newEvent") {
      setHistoryStack([]);
    } else {
      const shouldAddToHistory =
        currentPage === "dashboard" || currentPage === "evetnDetails";
      if (shouldAddToHistory) {
        setHistoryStack((prevHistoryStack) => [
          ...prevHistoryStack,
          { page: currentPage, data },
        ]);
      }
    }
    // updateSessionStorage();
    setCurrentPage(page);
  };
  const goBack = () => {
    if (historyStack.length === 0) {
      return;
    }
    const lastState = historyStack.pop();
    const { page, data } = lastState || { page: "dashboard", data: null };
    navigate(page, data);
  };
  const resetNavigator = () => {
    // Reset state to their initial values
    setCurrentPage("catalog");
    setHistoryStack([]);
    setSelectedEventId(null);
    // Clear session storage
    sessionStorage.removeItem("userNavigatorState");
  };
  // const goBack = () => {
  //   setHistoryStack(prevHistoryStack => {
  //     if (prevHistoryStack.length === 0) return prevHistoryStack;

  //     const newHistoryStack = [...prevHistoryStack];
  //     const lastState = newHistoryStack.pop();

  //     if (!lastState) return prevHistoryStack;

  //     setCurrentPage(lastState.page);
  //     updateSessionStorage();
  //     return newHistoryStack;
  //   });
  // };
  const contextValue: BackofficeNavigatorContextData = {
    currentPage,
    navigate,
    historyStack,
    goBack,
    selectedEventId,
    resetNavigator,
  };
  return (
    <BackofficeNavigatorContext.Provider value={contextValue}>
      {children}
    </BackofficeNavigatorContext.Provider>
  );
};
