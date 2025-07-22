import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getMetaDataAsync, getCountriesAsync, getStatesAsync, setMetadataCategory } from '@/app/store/features/metaDataSlice';

export const useMetaDataLoader = () => {
  const dispatch = useDispatch();

  const loadMetaData = useCallback(async () => {
    try {
      let result = await dispatch(getMetaDataAsync({ category: 'Caste' })).unwrap();
      dispatch(setMetadataCategory({ category: 'Caste', payload: result }));

      result = await dispatch(getMetaDataAsync({ category: 'Gender' })).unwrap();
      dispatch(setMetadataCategory({ category: 'Gender', payload: result }));

      result = await dispatch(getCountriesAsync({})).unwrap();
      dispatch(setMetadataCategory({ category: 'country', payload: result }));
    } catch (error) {
      // Handle error if needed
    }
  }, [dispatch]);

  const loadStates = useCallback(async (selectedCountry: string) => {
    try {
      let result = await dispatch(getStatesAsync({ country: selectedCountry })).unwrap();
      dispatch(setMetadataCategory({ category: 'state', payload: result }));
    } catch (error) {
      // Handle error if needed
    }
  }, [dispatch]);

  return { loadMetaData, loadStates };
};