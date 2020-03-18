import React from 'react';
import { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import {
  PageSidebar,
  Nav,
  NavList,
  NavItem,
  // WizardNav,
  // WizardNavItem,
} from '@patternfly/react-core';
import { setCurrentStep } from '../actions/clusterWizard';
import { WizardStep } from '../models/wizard';
import { RootState } from '../store/rootReducer';

const ClusterWizardSteps: React.FC = () => {
  const currentStep: WizardStep = useSelector((state: RootState) => state.clusterWizard.step);
  const dispatch: Dispatch = useDispatch();

  const nav = (
    <Nav
      onSelect={({ itemId }) => dispatch(setCurrentStep(itemId as WizardStep))}
      aria-label="Cluster deployment wizard steps"
    >
      <NavList>
        <NavItem
          id="cluster-wizard-steps-cluster-setup"
          itemId={WizardStep.ClusterSetup}
          isActive={currentStep === WizardStep.ClusterSetup}
        >
          Cluster setup
        </NavItem>
        <NavItem
          id="cluster-wizard-steps-add-hosts"
          itemId={WizardStep.AddHosts}
          isActive={currentStep === WizardStep.AddHosts}
        >
          Add hosts
        </NavItem>
        <NavItem
          id="cluster-wizard-steps-results"
          itemId={WizardStep.Results}
          isActive={currentStep === WizardStep.Results}
        >
          Results
        </NavItem>
      </NavList>
    </Nav>
  );

  // const nav = (
  //   <WizardNav returnList>
  //     <WizardNavItem
  //       text="Cluster Setup"
  //       isCurrent={currentStep === WizardStep.ClusterSetup}
  //       step={WizardStep.ClusterSetup}
  //     />
  //     <WizardNavItem
  //       text="Add Hosts"
  //       isCurrent={currentStep === WizardStep.AddHosts}
  //       step={WizardStep.AddHosts}
  //     />
  //     <WizardNavItem
  //       text="Results"
  //       isCurrent={currentStep === WizardStep.Results}
  //       step={WizardStep.Results}
  //     />
  //   </WizardNav>
  // );
  return <PageSidebar nav={nav} />;
};

export default ClusterWizardSteps;
