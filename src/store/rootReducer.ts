import { StateType } from 'typesafe-actions';
import { combineReducers } from 'redux';
import hostsReducer from '../reducers/hosts';

const rootReducer = combineReducers({
  hosts: hostsReducer
});

export type RootState = StateType<typeof rootReducer>;

export default rootReducer;
