import { combineReducers } from '@reduxjs/toolkit';
import registerReducer from './features/registerSlice';
import authReducer from './features/authSlice';
import profileReducer from './features/profileSlice';
import metaDataReducer from './features/metaDataSlice';
import searchReducer from './features/searchSlice';

const rootReducer = combineReducers({
  register: registerReducer,
  auth: authReducer,
  profile: profileReducer,
  metaData: metaDataReducer,
  search: searchReducer,
});

export default rootReducer;