import React from 'react';
import { Cluster } from '../../api/types';
import BaremetalInventory from './BaremetalInventory';
import ClusterWizardForm from './ClusterWizardForm';
import { WizardStep } from '../../types/wizard';

type Props = {
  cluster: Cluster;
};

const ClusterWizard: React.FC<Props> = ({ cluster }) => {
  const [step, setStep] = React.useState(WizardStep.BaremetalInventory);

  switch (step) {
    case WizardStep.ClusterConfiguration:
      return <ClusterWizardForm cluster={cluster} setStep={setStep} />;
    default:
      return <BaremetalInventory cluster={cluster} setStep={setStep} />;
  }
};

export default ClusterWizard;
