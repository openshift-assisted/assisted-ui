import React from 'react';
import { connect } from 'react-redux';

import BaremetalInventory from './BaremetalInventory';
import CreateClusterForm from './createCluster/CreateClusterForm';
import Clusters from './clusters/Clusters';
import { WizardStep } from '../types/wizard';
import { RootState } from '../store/rootReducer';
import { setCurrentStep } from '../actions/clusterWizard';

interface ClusterWizardProps {
  currentStep: WizardStep;
  setCurrentStep: (step: WizardStep) => void;
}

const ClusterWizard: React.FC<ClusterWizardProps> = ({ currentStep, setCurrentStep }) => {
  switch (currentStep) {
    case WizardStep.AccountLogin:
      return <CreateClusterForm setCurrentStep={setCurrentStep} />;
    case WizardStep.ManagedClusters:
      return <Clusters setCurrentStep={setCurrentStep} />;
    case WizardStep.ManageHosts:
      return <BaremetalInventory setCurrentStep={setCurrentStep} />;
    default:
      return null;
  }
};

const mapStateToProps = (state: RootState) => ({
  currentStep: state.clusterWizard.step,
});

export default connect(mapStateToProps, { setCurrentStep })(ClusterWizard);
