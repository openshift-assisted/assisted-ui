import React, { FC } from 'react';
import { List, PageSectionVariants } from '@patternfly/react-core';
import ClusterWizardStep from './ClusterWizardStep';

import PageSection from './ui/PageSection';

interface ClusterWizardStep {
  title: string;
}

interface ClusterWizardStepsProps {
  steps: ClusterWizardStep[];
  currentStepIndex: number;
}

const ClusterWizardSteps: FC<ClusterWizardStepsProps> = ({
  steps,
  currentStepIndex
}: ClusterWizardStepsProps): JSX.Element => (
  <PageSection variant={PageSectionVariants.light}>
    <List variant="inline">
      {steps.map((step, index) => (
        <ClusterWizardStep
          key={index}
          index={index}
          currentStepIndex={currentStepIndex}
          {...step}
        />
      ))}
    </List>
  </PageSection>
);

export default ClusterWizardSteps;
