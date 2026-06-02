import React, { createContext, useContext, useState } from 'react';
import { mockUserProfiles } from '../mockData/users';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(mockUserProfiles[0]);

  const [wasteItems, setWasteItems] = useState([]);

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
