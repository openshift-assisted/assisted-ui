import React from 'react';
import { connect } from 'react-redux';

import BaremetalInventory from './BaremetalInventory';
import CreateClusterForm from './createCluster/CreateClusterForm';
import { WizardStep } from '../models/wizard';
import { RootState } from '../store/rootReducer';
import { setCurrentStep } from '../actions/clusterWizard';

interface ClusterWizardProps {
  currentStep: WizardStep;
  setCurrentStep: (step: WizardStep) => void;
}

const ClusterWizard: React.FC<ClusterWizardProps> = ({ currentStep, setCurrentStep }) => {
  switch (currentStep) {
    case WizardStep.ClusterSetup:
      return <CreateClusterForm setCurrentStep={setCurrentStep} />;
    case WizardStep.AddHosts:
      return <BaremetalInventory setCurrentStep={setCurrentStep} />;
    default:
      return null;
  }
};

const mapStateToProps = (state: RootState): { currentStep: WizardStep } => ({
  currentStep: state.clusterWizard.step,
});

export default connect(mapStateToProps, { setCurrentStep })(ClusterWizard);
