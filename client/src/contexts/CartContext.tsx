import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getCartByUserId } from '../services/api';
import type { User } from '../types';

interface CartContextType {
  cartItemCount: number;
  refreshCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setCartItemCount(0);
      return;
    }

    try {
      setIsLoading(true);
      const user: User = JSON.parse(userStr);
      const cart = await getCartByUserId(user.userID);
      setCartItemCount(cart.totalItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItemCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart on mount and when user logs in
  useEffect(() => {
    refreshCart();
  }, []);

  // Listen for storage changes (e.g., login/logout in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        refreshCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <CartContext.Provider value={{ cartItemCount, refreshCart, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};
