import { combineReducers } from '@reduxjs/toolkit';
import registerReducer from './features/registerSlice';
import authReducer from './features/authSlice';
import profileReducer from './features/profileSlice';

const rootReducer = combineReducers({
  register: registerReducer,
  auth: authReducer,
  profile: profileReducer
});

export default rootReducer;