import { createStore } from 'redux';
import rootReducer from './rootReducer';

const initialState = {};

export const store = createStore(rootReducer, initialState);
