import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAccountDetailsAsync, setUser } from '../store/features/authSlice';
import { useAppSelector } from '../store/store';
import { decodeJWT } from './jwtUtils';

export const useFetchUser = () => {
  const dispatch = useDispatch();
  const userData = useAppSelector((state) => state.auth.userData);
//   const decodedToken = (userData && userData?.token) ? decodeJWT(userData?.token) : '';

  const fetchAccountDetls = useCallback(async () => {
    try {
      dispatch(fetchAccountDetailsAsync(userData?.email)).then((res: any) => {
        if (res.payload && res.payload.success) {
            dispatch(setUser(res.payload?.data?.[0]));
        } else {
            console.error("Failed to fetch account details:", res.payload?.message); 
        }
        }).catch((error: any) => {
            console.error("Error fetching account details:", error); 
        });
    } catch (error) {
      // Handle error if needed
    }
  }, [dispatch]);

  return { fetchAccountDetls };
};