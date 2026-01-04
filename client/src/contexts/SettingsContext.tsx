import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getStoreInfo } from '../services/api';

interface StoreInfo {
  storeName: string;
  email: string;
  phone: string;
  address: string;
  taxCode: string;
}

interface SettingsContextType {
  storeInfo: StoreInfo;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultStoreInfo: StoreInfo = {
  storeName: 'CÔNG TY TNHH KAROTA VIỆT NAM',
  email: 'thanglongtape@gmail.com',
  phone: '0243.681.6262',
  address: 'Xã Thanh Trì - Hà Nội',
  taxCode: '0123456789',
};

const SettingsContext = createContext<SettingsContextType>({
  storeInfo: defaultStoreInfo,
  isLoading: false,
  refreshSettings: async () => {},
});

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(defaultStoreInfo);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      setIsLoading(true);
      const data = await getStoreInfo();
      setStoreInfo(data);
    } catch (error) {
      console.error('Error loading store settings:', error);
      // Keep default values if API fails
      setStoreInfo(defaultStoreInfo);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ storeInfo, isLoading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
