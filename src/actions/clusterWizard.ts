import { createAction } from 'typesafe-actions';
import { WizardStep } from '../models/wizardStep';

export const setCurrentStep = createAction(
  'SET_CURRENT_WIZARD_STEP',
  resolve => (step: WizardStep) => resolve(step)
);
