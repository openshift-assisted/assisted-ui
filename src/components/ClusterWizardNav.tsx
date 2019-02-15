import React, { FC } from 'react';
import {
  Button,
  PageSectionVariants,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';

import PageSection from './ui/PageSection';
import { WizardStep } from '../models/wizardStep';

interface ClusterWizardNavProps {
  currentStep: WizardStep;
  setCurrentStep: (step: WizardStep) => void;
}

const ClusterWizardNav: FC<ClusterWizardNavProps> = ({
  currentStep,
  setCurrentStep
}: ClusterWizardNavProps): JSX.Element => (
  <PageSection
    variant={PageSectionVariants.light}
    className="pf-u-box-shadow-lg-top"
  >
    {currentStep === WizardStep.ClusterSetup && (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarItem>
            <Button
              variant="primary"
              onClick={() => setCurrentStep(WizardStep.AddHosts)}
            >
              Next
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    )}
    {currentStep === WizardStep.AddHosts && (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarItem>
            <Button
              variant="secondary"
              onClick={() => setCurrentStep(WizardStep.ClusterSetup)}
            >
              Back
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem>
            <Button variant="primary" isDisabled>
              Next
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    )}
  </PageSection>
);

export default ClusterWizardNav;
