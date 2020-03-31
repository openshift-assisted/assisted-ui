import { StateType } from 'typesafe-actions';
import { combineReducers } from 'redux';
import hostsReducer from '../reducers/hosts';
import clustersReducer from '../reducers/clusters';
import clusterWizardReducer from '../reducers/clusterWizard';

const rootReducer = combineReducers({
  clusters: clustersReducer,
  hosts: hostsReducer,
  clusterWizard: clusterWizardReducer,
});

export type RootState = StateType<typeof rootReducer>;

export default rootReducer;
