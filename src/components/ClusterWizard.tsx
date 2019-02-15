import React, { FC, Fragment } from 'react';
import { connect } from 'react-redux';

import BaremetalInventory from './BaremetalInventory';
import ClusterWizardNav from './ClusterWizardNav';
import CreateClusterForm from './createCluster/CreateClusterForm';
import { WizardStep } from '../models/wizardStep';
import { RootState } from '../store/rootReducer';
import { setCurrentStep } from '../actions/clusterWizard';

interface ClusterWizardProps {
  currentStep: WizardStep;
  setCurrentStep: (step: WizardStep) => void;
}

const ClusterWizard: FC<ClusterWizardProps> = ({
  currentStep,
  setCurrentStep
}: ClusterWizardProps): JSX.Element => (
  <Fragment>
    {currentStep === WizardStep.ClusterSetup && <CreateClusterForm />}
    {currentStep === WizardStep.AddHosts && <BaremetalInventory />}
    <ClusterWizardNav
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
    />
  </Fragment>
);

const mapStateToProps = (state: RootState): { currentStep: WizardStep } => ({
  currentStep: state.clusterWizard.step
});

export default connect(
  mapStateToProps,
  { setCurrentStep }
)(ClusterWizard);
