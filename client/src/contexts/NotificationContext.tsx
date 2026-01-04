import { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationContextType {
  shouldRefreshOrders: boolean;
  triggerOrdersRefresh: () => void;
  resetOrdersRefresh: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [shouldRefreshOrders, setShouldRefreshOrders] = useState(false);

  const triggerOrdersRefresh = () => {
    setShouldRefreshOrders(true);
  };

  const resetOrdersRefresh = () => {
    setShouldRefreshOrders(false);
  };

  return (
    <NotificationContext.Provider value={{ shouldRefreshOrders, triggerOrdersRefresh, resetOrdersRefresh }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
