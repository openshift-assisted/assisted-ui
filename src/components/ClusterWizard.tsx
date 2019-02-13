import React, { FC, Fragment } from 'react';

import BaremetalInventory from './BaremetalInventory';
import ClusterWizardNav from './ClusterWizardNav';
// import ClusterWizardSteps from './ClusterWizardSteps';

const ClusterWizard: FC = (): JSX.Element => (
  <Fragment>
    {/* <ClusterWizardSteps
      steps={[{ title: 'First' }, { title: 'Second' }]}
      currentStepIndex={0}
    /> */}
    <BaremetalInventory />
    <ClusterWizardNav />
  </Fragment>
);

export default ClusterWizard;
