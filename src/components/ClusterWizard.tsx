import React, { FC, Fragment } from 'react';

import BaremetalInventory from './BaremetalInventory';
import ClusterWizardNav from './ClusterWizardNav';
import CreateClusterForm from './createCluster/CreateClusterForm';

interface ClusterWizardProps {
  currentStepIndex: number;
}

const ClusterWizard: FC<ClusterWizardProps> = ({
  currentStepIndex
}: ClusterWizardProps): JSX.Element => (
  <Fragment>
    {currentStepIndex === 0 && <CreateClusterForm />}
    {currentStepIndex === 1 && <BaremetalInventory />}
    <ClusterWizardNav />
  </Fragment>
);

export default ClusterWizard;
