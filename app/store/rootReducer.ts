import { combineReducers } from '@reduxjs/toolkit';
import registerReducer from './features/registerSlice';

const rootReducer = combineReducers({
  register: registerReducer
});

export default rootReducer;