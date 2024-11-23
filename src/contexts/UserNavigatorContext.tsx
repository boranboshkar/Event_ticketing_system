// UserNavigatorContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

  
  interface CheckoutDetails {
    orderId: string;
    eventId: string;
    eventName: string;
    userId: string;
    categoryId: string;
    categoryName: string;
    quantity: number;
    pricePerTicket: number;
  }
    
interface NavigationState {
  page: string;
  data?: any;
}

interface UserNavigatorContextData {
  currentPage: string;
  navigate: (page: string, data?: any) => void;
  goBack: () => void;
  historyStack: NavigationState[];
  selectedEventId: string | null;
  checkoutDetails:CheckoutDetails | null,
  resetNavigator: () => void;

}


const defaultUserNavigationData: UserNavigatorContextData = {
  currentPage: 'catalog',
  navigate: () => {},
  goBack: () => {},
  historyStack: [],
  selectedEventId: null,
  checkoutDetails: null,
  resetNavigator:() => {}
};

export const UserNavigatorContext = createContext<UserNavigatorContextData>(defaultUserNavigationData);

export const useUserNavigator = () => useContext(UserNavigatorContext);

export const UserNavigatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const savedState = JSON.parse(sessionStorage.getItem('userNavigatorState') || 'null') || defaultUserNavigationData;

    const [currentPage, setCurrentPage] = useState(savedState.currentPage);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(savedState.selectedEventId);
    const [historyStack, setHistoryStack] = useState<NavigationState[]>(savedState.historyStack);
    const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails | null>(savedState.checkoutDetails);


  useEffect(() => {
    const savedState = JSON.parse(sessionStorage.getItem('userNavigatorState') || 'null');
    if (savedState) {
      setCurrentPage(savedState.currentPage);
      setHistoryStack(savedState.historyStack);
    }
  }, []);

  useEffect(() => {
    const state = { currentPage, historyStack, selectedEventId, checkoutDetails};
    sessionStorage.setItem('userNavigatorState', JSON.stringify(state));
  }, [currentPage, historyStack,selectedEventId,checkoutDetails]);

  const navigate = (page: string, data?: any) => {
    // Always clear history stack when navigating to 'catalog' or 'profile'
    if (page === 'checkout' || page ==='Success' && data) {
      setCheckoutDetails(data);
    }
    if(currentPage === 'checkout' &&(page !=='Success')){
      // we need to release the reserved tickets. 
    }
    if (page === 'event' && data?.selectedEventId) {
      setSelectedEventId(data.selectedEventId);
    } else if (page !== 'event') {
      setSelectedEventId(null);
    }
    if (page === 'catalog' || page === 'profile' || page ==='Success') {
      setHistoryStack([]);
    } else {
      const shouldAddToHistory = currentPage === 'catalog' || currentPage === 'event';
      if (shouldAddToHistory) {
        setHistoryStack(prevHistoryStack => [
          ...prevHistoryStack,
          { page: currentPage, data: { selectedEventId } },
        ]);
      }
    }
    setCurrentPage(page);
  };
  
  const resetNavigator = () => {
    // Reset state to their initial values
    setCurrentPage('catalog');
    setHistoryStack([]);
    setSelectedEventId(null);
    setCheckoutDetails(null);

    // Clear session storage
    sessionStorage.removeItem('userNavigatorState');
};
  const goBack = () => {
    if (historyStack.length === 0) {
      // Optionally handle the case where there's no history (e.g., display a message)
      return;
    }
    // Extract the last state from the history stack
    const lastState = historyStack.pop();
    const { page, data } = lastState || { page: 'main', data: null };
    navigate(page, data);
  };
  
  const contextValue: UserNavigatorContextData = {
    currentPage,
    selectedEventId,
    navigate,
    historyStack,
    goBack,
    checkoutDetails,
    resetNavigator
  };
  return (
    <UserNavigatorContext.Provider value={contextValue}>
      {children}
    </UserNavigatorContext.Provider>
  );
};
