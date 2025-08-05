import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getMetaDataAsync, getCountriesAsync, getStatesAsync, setMetadataCategory } from '@/app/store/features/metaDataSlice';
import { useAppSelector } from '../store/store';

export const useMetaDataLoader = () => {
  const dispatch = useDispatch();
  const {countryList, stateList, job_titleList} = useAppSelector((state) => state.metaData);

  const loadMetaDataCategory = async(category:string) => {
    const result = await dispatch(getMetaDataAsync({ category })).unwrap();
    dispatch(setMetadataCategory({ category, payload: result }));
  }

  const loadMetaData = useCallback(async () => {
    try {
      loadMetaDataCategory('Caste')
      loadMetaDataCategory('Gender');
      loadMetaDataCategory('property_type');
      loadMetaDataCategory('photo_type');
      loadMetaDataCategory('ownership_type');
      loadMetaDataCategory('job_title');
      loadMetaDataCategory('field_of_study');
      loadMetaDataCategory('employment_status');
      loadMetaDataCategory('education_level');
      loadMetaDataCategory('contact_type');
      loadMetaDataCategory('Address Type');
      loadMetaDataCategory('Disability');
      loadMetaDataCategory('Religion');
      loadMetaDataCategory('Family');
      loadMetaDataCategory('Reference');
      loadMetaDataCategory('Phone Type');
      loadMetaDataCategory('Marital Status');
      loadMetaDataCategory('Contact Us');

      loadMetaDataCategory('Profession');
      loadMetaDataCategory('Nationality');
      loadMetaDataCategory('Friend');
      loadMetaDataCategory('hobby');
      loadMetaDataCategory('interest'); 

      const result = await dispatch(getCountriesAsync({})).unwrap();
      const modifiedResult = result.map((item) => {
        return {...item, id:item.country_id, name:item.country_name}
      })
      dispatch(setMetadataCategory({ category: 'country', payload: modifiedResult }));
    } catch (error) {
      // Handle error if needed
    }
  }, [dispatch]);

  const loadStates = useCallback(async (selectedCountry?: string) => {
    try {
      let result = await dispatch(getStatesAsync({ country: selectedCountry || null })).unwrap();
      const modifiedResult = result.map((item) => {
        return {...item, id:item.state_id, name:item.state_name}
      })
      dispatch(setMetadataCategory({ category: 'state', payload: modifiedResult }));
    } catch (error) {
      // Handle error if needed
    }
  }, [dispatch]);

  const formatWithMetaData = (data:any):any => {
    console.log(data)
    const formattedData = data.map((item:any) => {
      return {
        ...item,
        
        ...(item?.country || item?.country_id ? { country: findCountryName(item?.country_id || item?.country) } : {}),
        ...(item?.state || item?.state_id ? { state: findStateName(item?.state_id || item?.state) } : {}),
        ...(item?.job_title_id ? { job_title: findJobTitleName(item?.job_title_id) } : {}),
      }
    })

    return formattedData;
  }

  const findCountryName = (compareVal:number):string => {
    let match:any;
    countryList.map((i:any) => {
      console.log(i, compareVal)
      if(i.id === compareVal) match = i;
    })
    console.log(match)
    return match?.name;
  }
  const findStateName = (compareVal:number):string => {
    let match:any;
    stateList.map((i:any) => {
      if(i.id === compareVal) match = i;
    })
    return match?.name;
  }
  const findJobTitleName = (compareVal:number):string => {
    let match:any;
    job_titleList.map((i:any) => {
      if(i.id === compareVal) match = i;
    })
    return match?.name;
  }

  return { 
    loadMetaData, 
    loadStates, 
    formatWithMetaData,
    findCountryName,
    findStateName,
    findJobTitleName,
  };
};