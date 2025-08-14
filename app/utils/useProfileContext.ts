"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

type ProfileContextType = {
  selectedProfileID: number;
  setSelectedProfileID: (id: number) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileContextProviderProps {
  children: ReactNode;
}

export function ProfileContextProvider({ children }: ProfileContextProviderProps) {
  const [selectedProfileID, setSelectedProfileID] = useState(0);
  
  const value = {
    selectedProfileID,
    setSelectedProfileID
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileContextProvider');
  }
  return context;
}
