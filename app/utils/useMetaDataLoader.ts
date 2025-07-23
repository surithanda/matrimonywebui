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
      const modifiedResult = result.map((item) => {
        return {...item, id:item.country_id, name:item.country_name}
      })
      dispatch(setMetadataCategory({ category: 'country', payload: modifiedResult }));
    } catch (error) {
      // Handle error if needed
    }
  }, [dispatch]);

  const loadStates = useCallback(async (selectedCountry: string) => {
    try {
      let result = await dispatch(getStatesAsync({ country: selectedCountry })).unwrap();
      const modifiedResult = result.map((item) => {
        return {...item, id:item.state_id, name:item.state_name}
      })
      dispatch(setMetadataCategory({ category: 'state', payload: modifiedResult }));
    } catch (error) {
      // Handle error if needed
    }
  }, [dispatch]);

  return { loadMetaData, loadStates };
};