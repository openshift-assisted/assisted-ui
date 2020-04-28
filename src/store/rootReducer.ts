import { combineReducers } from 'redux';
import clustersReducer from '../features/clusters/clustersSlice';

const rootReducer = combineReducers({
  clusters: clustersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
