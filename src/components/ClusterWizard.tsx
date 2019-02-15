import React, { FC, Fragment } from 'react';

import BaremetalInventory from './BaremetalInventory';
import ClusterWizardNav from './ClusterWizardNav';
import CreateClusterForm from './createCluster/CreateClusterForm';
import { WizardStep } from '../models/wizardStep';

interface ClusterWizardProps {
  currentStep: WizardStep;
}

const ClusterWizard: FC<ClusterWizardProps> = ({
  currentStep
}: ClusterWizardProps): JSX.Element => (
  <Fragment>
    {currentStep === WizardStep.ClusterSetup && <CreateClusterForm />}
    {currentStep === WizardStep.AddHosts && <BaremetalInventory />}
    <ClusterWizardNav />
  </Fragment>
);

export default ClusterWizard;
