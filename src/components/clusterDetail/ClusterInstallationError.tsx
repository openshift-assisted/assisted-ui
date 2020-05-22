import React from 'react';
import { GridItem, Alert, AlertVariant } from '@patternfly/react-core';
import { Cluster } from '../../api/types';

type ClusterInstallationErrorProps = {
  // progressInfo: Cluster['progressInfo']; // TODO(jtomasek) replace this once progressInfo is available
  progressInfo: {
    steps: string[];
    currentStep: string;
  };
  statusInfo: Cluster['statusInfo'];
};
const ClusterInstallationError: React.FC<ClusterInstallationErrorProps> = ({
  progressInfo,
  statusInfo,
}) => {
  const { steps, currentStep } = progressInfo;
  const currentStepNumber = steps.indexOf(currentStep) + 1;

  return (
    <GridItem>
      <Alert
        variant={AlertVariant.danger}
        title={`Step ${currentStepNumber}: '${currentStep}' failed`}
        isInline
      >
        {statusInfo}
      </Alert>
    </GridItem>
  );
};

export default ClusterInstallationError;
