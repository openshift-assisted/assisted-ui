import React, { FC, Fragment } from 'react';

// import BaremetalInventory from './BaremetalInventory';
import ClusterWizardNav from './ClusterWizardNav';
// import ClusterWizardSteps from './ClusterWizardSteps';
import CreateClusterForm from './createCluster/CreateClusterForm';

const ClusterWizard: FC = (): JSX.Element => (
  <Fragment>
    {/* <ClusterWizardSteps
      steps={[{ title: 'First' }, { title: 'Second' }]}
      currentStepIndex={0}
    /> */}
    {/* <BaremetalInventory /> */}
    <CreateClusterForm />
    <ClusterWizardNav />
  </Fragment>
);

export default ClusterWizard;
