'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Store, UserInfo, OrderItem } from '@/types';

interface UserContextType {
  favorites: string[]; // Product IDs
  favoriteStores: string[]; // Store IDs
  toggleFavorite: (productId: string) => void;
  toggleFavoriteStore: (storeId: string) => void;
  isFavorite: (productId: string) => boolean;
  isFavoriteStore: (storeId: string) => boolean;
  userInfo: UserInfo | null;
  updateUserInfo: (info: UserInfo) => void;
  orderHistory: OrderItem[];
  addOrderToHistory: (items: any[], storeName: string) => void;
}

const defaultContext: UserContextType = {
  favorites: [],
  favoriteStores: [],
  toggleFavorite: () => {},
  toggleFavoriteStore: () => {},
  isFavorite: () => false,
  isFavoriteStore: () => false,
  userInfo: null,
  updateUserInfo: () => {},
  orderHistory: [],
  addOrderToHistory: () => {},
};

const UserContext = createContext<UserContextType>(defaultContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteStores, setFavoriteStores] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const favs = localStorage.getItem('shopyump_favorites');
      const stores = localStorage.getItem('shopyump_favorite_stores');
      const info = localStorage.getItem('shopyump_user_info');
      const history = localStorage.getItem('shopyump_order_history');

      if (favs) setFavorites(JSON.parse(favs));
      if (stores) setFavoriteStores(JSON.parse(stores));
      if (info) setUserInfo(JSON.parse(info));
      if (history) setOrderHistory(JSON.parse(history));
    } catch (e) {
      console.error('Failed to load user data', e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('shopyump_favorites', JSON.stringify(favorites));
  }, [favorites, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('shopyump_favorite_stores', JSON.stringify(favoriteStores));
  }, [favoriteStores, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (userInfo) localStorage.setItem('shopyump_user_info', JSON.stringify(userInfo));
  }, [userInfo, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('shopyump_order_history', JSON.stringify(orderHistory));
  }, [orderHistory, mounted]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const toggleFavoriteStore = (storeId: string) => {
    setFavoriteStores(prev => 
      prev.includes(storeId) 
        ? prev.filter(id => id !== storeId) 
        : [...prev, storeId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);
  const isFavoriteStore = (storeId: string) => favoriteStores.includes(storeId);

  const updateUserInfo = (info: UserInfo) => setUserInfo(info);

  const addOrderToHistory = (items: any[], storeName: string) => {
    const newOrders: OrderItem[] = items.map(item => ({
      id: Math.random().toString(36).substr(2, 9),
      productId: item.id,
      productName: item.name,
      productImage: item.image,
      storeName: storeName,
      price: item.price,
      quantity: item.quantity,
      date: new Date().toISOString()
    }));
    setOrderHistory(prev => [...newOrders, ...prev]);
  };

  return (
    <UserContext.Provider value={{ 
      favorites, 
      favoriteStores, 
      toggleFavorite, 
      toggleFavoriteStore, 
      isFavorite, 
      isFavoriteStore,
      userInfo,
      updateUserInfo,
      orderHistory,
      addOrderToHistory
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  return context;
};
