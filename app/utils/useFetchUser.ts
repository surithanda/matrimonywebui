import { useCallback } from 'react';
import { useAppDispatch } from '../store/store';
import { fetchAccountDetailsAsync, setUser } from '../store/features/authSlice';
import { useAppSelector } from '../store/store';
import { decodeJWT } from './jwtUtils';

export const useFetchUser = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.auth.userData);
//   const decodedToken = (userData && userData?.token) ? decodeJWT(userData?.token) : '';

  const fetchAccountDetls = useCallback(async () => {
    if (userData?.user?.email) {
      try {
        const res = await dispatch(fetchAccountDetailsAsync(userData?.user?.email));
        if (res.payload && res.payload.success) {
          console.log("Fetched account details")
          dispatch(setUser(res.payload?.data?.[0]));
        } else {
          console.error("Failed to fetch account details:", res.payload?.message);
        }
      } catch (error: any) {
        console.error("Error fetching account details:", error);
      }
    }
  }, [dispatch, userData]);

  return { fetchAccountDetls };
};