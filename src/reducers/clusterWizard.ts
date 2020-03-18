import { ActionType, getType } from 'typesafe-actions';

import * as clusterWizardActions from '../actions/clusterWizard';
import { WizardStep } from '../models/wizard';

export interface ClusterWizardState {
  step: WizardStep;
}

const clusterWizard = (
  // state = { step: WizardStep.ClusterSetup },
  state = { step: WizardStep.AddHosts },
  action: ActionType<typeof clusterWizardActions>,
): ClusterWizardState => {
  switch (action.type) {
    case getType(clusterWizardActions.setCurrentStep):
      return { ...state, step: action.payload };
    default:
      return state;
  }
};

export default clusterWizard;
