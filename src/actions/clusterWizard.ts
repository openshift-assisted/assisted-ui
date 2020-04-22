import { createAction } from 'typesafe-actions';
import { WizardStep } from '../types/wizard';

export const setCurrentStep = createAction('SET_CURRENT_WIZARD_STEP')<WizardStep>();
