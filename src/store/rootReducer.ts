import { combineReducers } from 'redux';
import nodesReducer from '../reducers/nodes';

const rootReducer = combineReducers({
  nodes: nodesReducer
});

export default rootReducer;
