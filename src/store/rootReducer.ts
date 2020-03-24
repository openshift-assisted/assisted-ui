import { StateType } from 'typesafe-actions';
import { combineReducers } from 'redux';
import resourceListReducer from '../reducers/resourceList';
import clusterWizardReducer from '../reducers/clusterWizard';

const rootReducer = combineReducers({
  resources: resourceListReducer,
  clusterWizard: clusterWizardReducer,
});

export type RootState = StateType<typeof rootReducer>;

export default rootReducer;
