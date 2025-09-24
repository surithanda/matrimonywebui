"use client";
import { useParams, notFound } from 'next/navigation';
import { useEffect } from 'react';
import { isValidProfileMode, type ProfileMode } from '../types/profileMode';

export function useValidatedProfileMode(): ProfileMode {
  const params = useParams();
  const mode = params.mode as string;

  useEffect(() => {
    if (mode && !isValidProfileMode(mode)) {
      console.error(`Invalid profile mode: ${mode}`);
      notFound();
    }
  }, [mode]);

  if (!mode) {
    throw new Error('Mode parameter is required');
  }

  if (!isValidProfileMode(mode)) {
    notFound();
  }

  return mode;
}

export function useProfileModeInfo() {
  const mode = useValidatedProfileMode();
  
  return {
    mode,
    isCreateMode: mode === 'createprofile',
    isUpdateMode: mode === 'updateprofile',
    modeLabel: mode === 'createprofile' ? 'Create Profile' : 'Update Profile',
    apiMode: mode === 'createprofile' ? 'create' : 'update',
  };
}