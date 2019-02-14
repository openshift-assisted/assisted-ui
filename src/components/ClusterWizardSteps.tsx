import React, { FC } from 'react';
import { Nav, NavList, NavItem } from '@patternfly/react-core';

interface ClusterWizardStepsProps {
  currentStepIndex: number;
}

const ClusterWizardSteps: FC<ClusterWizardStepsProps> = ({
  currentStepIndex
}: ClusterWizardStepsProps): JSX.Element => (
  <Nav
    onToggle={() => {}}
    onSelect={() => {}}
    aria-label="Cluster deployment wizard steps"
  >
    <NavList>
      <NavItem
        id="cluster-wizard-steps-cluster-setup"
        to="#"
        itemId={0}
        isActive={currentStepIndex === 0}
      >
        1. Cluster setup
      </NavItem>
      <NavItem
        id="cluster-wizard-steps-add-hosts"
        to="#"
        itemId={1}
        isActive={currentStepIndex === 1}
      >
        2. Add hosts
      </NavItem>
      <NavItem
        id="cluster-wizard-steps-results"
        to="#"
        itemId={2}
        isActive={currentStepIndex === 2}
      >
        3. Results
      </NavItem>
    </NavList>
  </Nav>
);

export default ClusterWizardSteps;
