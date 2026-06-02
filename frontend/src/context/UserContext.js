import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUserProfiles } from '../mockData/users';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const { user: authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(mockUserProfiles[0]);

  const [wasteItems, setWasteItems] = useState([]);

  useEffect(() => {
    if (authUser) {
      // If Supabase profiles row was attached to authUser.profile, prefer it.
      const profile = authUser.profile || null;
      const mapped = {
        id: authUser.id,
        email: authUser.email,
        name: (profile && (profile.full_name || profile.name)) || authUser.email?.split('@')[0] || 'User',
        city: profile?.city || profile?.location || 'India',
        points: profile?.points ?? 0,
        badges: profile?.badges ?? [],
        itemsDonated: profile?.items_donated ?? 0,
        itemsRecycled: profile?.items_recycled ?? 0,
        userType: profile?.role || profile?.user_type || 'individual',
        avatarInitials:
          (profile && (profile.initials || (profile.full_name || profile.name || '').slice(0, 2).toUpperCase())) ||
          (authUser.email && authUser.email.slice(0, 2).toUpperCase()),
      };
      setCurrentUser((prev) => ({ ...(prev || {}), ...mapped }));
    } else {
      // fallback to mock profile when not authenticated
      setCurrentUser(mockUserProfiles[0]);
    }
  }, [authUser]);

  const addWasteItem = (item) => {
    const newItem = {
      id: Date.now().toString(),
      ...item,
      createdAt: new Date(),
    };
    setWasteItems([...wasteItems, newItem]);
    return newItem;
  };

  const updateUserPoints = (points) => {
    setCurrentUser((prev) => ({
      ...prev,
      points: prev.points + points,
    }));
  };

  const addBadge = (badgeId) => {
    setCurrentUser((prev) => {
      if (!prev.badges.includes(badgeId)) {
        return {
          ...prev,
          badges: [...prev.badges, badgeId],
        };
      }
      return prev;
    });
  };

  const updateUserType = (userType) => {
    setCurrentUser((prev) => ({
      ...prev,
      userType,
    }));
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        wasteItems,
        addWasteItem,
        updateUserPoints,
        addBadge,
        updateUserType,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserContextProvider');
  }
  return context;
};
