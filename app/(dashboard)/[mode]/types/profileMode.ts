// Type definitions for profile modes
export type ProfileMode = 'createprofile' | 'updateprofile';

export const VALID_PROFILE_MODES: ProfileMode[] = ['createprofile', 'updateprofile'];

export function isValidProfileMode(mode: string): mode is ProfileMode {
  return VALID_PROFILE_MODES.includes(mode as ProfileMode);
}

export function validateProfileMode(mode: string): ProfileMode {
  if (!isValidProfileMode(mode)) {
    throw new Error(`Invalid profile mode: ${mode}. Valid modes are: ${VALID_PROFILE_MODES.join(', ')}`);
  }
  return mode;
}