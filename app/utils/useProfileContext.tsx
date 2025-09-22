"use client";
import { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';

type ProfileContextType = {
  selectedProfileID: number;
  setSelectedProfileID: (id: number) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileContextProviderProps {
  children: ReactNode;
}

export function ProfileContextProvider({ children }: ProfileContextProviderProps) {
  const [selectedProfileID, setSelectedProfileIDState] = useState<number>(Number(localStorage.getItem("profile")) || 0);

  useEffect(() => {
    localStorage.setItem("profile", String(selectedProfileID));
  }, [selectedProfileID]);

  // Memoize the setter function to prevent unnecessary re-renders
  const setSelectedProfileID = useCallback((id: number) => {
    setSelectedProfileIDState(id);
  }, []);

  const value = useMemo(() => ({
    selectedProfileID,
    setSelectedProfileID
  }), [selectedProfileID, setSelectedProfileID]);

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
