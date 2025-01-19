import { combineReducers } from '@reduxjs/toolkit';
import registerReducer from './features/registerSlice';
import authReducer from './features/authSlice';

const rootReducer = combineReducers({
  register: registerReducer,
  auth: authReducer
});

export default rootReducer;