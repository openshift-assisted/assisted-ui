import { ActionType, getType } from 'typesafe-actions';

import * as actions from '../actions/clusterWizard';
import { WizardStep } from '../types/wizard';

export interface ClusterWizardState {
  step: WizardStep;
}

const clusterWizard = (
  state = { step: WizardStep.ManagedClusters },
  action: ActionType<typeof actions>,
): ClusterWizardState => {
  switch (action.type) {
    case getType(actions.setCurrentStep):
      return { ...state, step: action.payload };
    default:
      return state;
  }
};

export default clusterWizard;
