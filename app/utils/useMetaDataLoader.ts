import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getMetaDataAsync, getCountriesAsync, getStatesAsync, setMetadataCategory } from '@/app/store/features/metaDataSlice';
import { useAppSelector } from '../store/store';

export const useMetaDataLoader = () => {
  const dispatch = useDispatch();
  const {countryList, stateList, job_titleList, property_typeList, ownership_typeList} = useAppSelector((state) => state.metaData);

  const loadMetaDataCategory = useCallback(async (category?: string) => {
    const result = await (dispatch as any)(getMetaDataAsync({ category })).unwrap();
    dispatch(setMetadataCategory({ category, payload: result }));
  }, [dispatch]);
  
  const categories: string[] = [
    'caste',
    'gender',
    'property_type',
    'photo_type',
    'ownership_type',
    'job_title',
    'field_of_study',
    'employment_status',
    'education_level',
    'contact_type',
    'address_type',
    'disability',
    'religion',
    'family',
    'reference',
    'phone_type',
    'marital_status',
    'contact_us',
    'profession',
    'nationality',
    'friend',
    'hobby',
    'interest'
  ];

  const loadIndividualMetaData = useCallback(async () => {
    try {
      categories.forEach(category => {
        loadMetaDataCategory(category);
      });

      loadCountries();
    } catch (error) {
      // Handle error if needed
    }
  }, [dispatch, loadMetaDataCategory]);

  const loadNecessaryMetaData = useCallback(async () => {
    try {
      loadMetaDataCategory('gender');
      loadCountries();
    } catch (error) {
      // Handle error if needed
    }
  }, [dispatch, loadMetaDataCategory]);

  const loadMetaData = useCallback(async () => {
    try {
      const result = await (dispatch as any)(getMetaDataAsync({ category: null })).unwrap();
      console.log("Metadata loaded:", result);
      
      // Group the data by category
      const groupedByCategory: { [key: string]: any[] } = {};
      
      result.forEach((item: any) => {
        const category = item.category;
        if (!groupedByCategory[category]) {
          groupedByCategory[category] = [];
        }
        groupedByCategory[category].push(item);
      });
      
      // Dispatch each category separately
      Object.keys(groupedByCategory).forEach(category => {
        dispatch(setMetadataCategory({ 
          category, 
          payload: groupedByCategory[category] 
        }));
      });
      
      loadCountries();
    } catch (error) {
      // Handle error if needed
    }
  }, [dispatch, loadMetaDataCategory]);

  const loadCountries = useCallback(async () => {
    try {
      let result = await (dispatch as any)(getCountriesAsync({})).unwrap();
      const modifiedResult = result.map((item: any) => {
        return {...item, id:item.country_id, name:item.country_name}
      })
      dispatch(setMetadataCategory({ category: 'country', payload: modifiedResult }));
    } catch (error) {
      // Handle error if needed
    }
  }, [dispatch]);

  const loadStates = useCallback(async (selectedCountry?: string) => {
    try {
      let result = await (dispatch as any)(getStatesAsync({ country: selectedCountry || null })).unwrap();
      const modifiedResult = result.map((item: any) => {
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
        ...(item?.property_type ? { property_type: findPropertyTypeName(item?.property_type) } : {}),
        ...(item?.ownership_type ? { ownership_type: findOwnershipTypeName(item?.ownership_type) } : {}),
      }
    })

    return formattedData;
  }

  const findCountryName = (compareVal:number):string => {
    let match:any;
    countryList?.map((i:any) => {
      console.log(i, compareVal)
      if(i.id === compareVal) match = i;
    })
    console.log(match)
    return match?.name;
  }
  const findStateName = (compareVal:number):string => {
    let match:any;
    stateList?.map((i:any) => {
      if(i.id === compareVal) match = i;
    })
    return match?.name;
  }
  const findJobTitleName = (compareVal:number):string => {
    let match:any;
    job_titleList?.map((i:any) => {
      if(i.id === compareVal) match = i;
    })
    return match?.name;
  }

  const findPropertyTypeName = (compareVal:number):string => {
    let match:any;
    property_typeList?.map((i:any) => {
      if(i.id === compareVal) match = i;
    })
    return match?.name;
  }

  const findOwnershipTypeName = (compareVal:number):string => {
    let match:any;
    ownership_typeList?.map((i:any) => {
      if(i.id === compareVal) match = i;
    })
    return match?.name;
  }

  return { 
    loadIndividualMetaData,
    loadNecessaryMetaData,
    loadMetaData, 
    loadCountries,
    loadStates, 
    formatWithMetaData,
    findCountryName,
    findStateName,
    findJobTitleName,
    findPropertyTypeName,
    findOwnershipTypeName,
  };
};