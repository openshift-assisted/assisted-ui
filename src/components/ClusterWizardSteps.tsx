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
import { WizardStep } from '../types/wizard';
import { RootState } from '../store/rootReducer';
import _ from 'lodash';

const ClusterWizardSteps: React.FC = () => {
  const currentStep: WizardStep = useSelector((state: RootState) => state.clusterWizard.step);
  const dispatch: Dispatch = useDispatch();

  const nav = (
    <Nav
      onSelect={({ itemId }) => dispatch(setCurrentStep(itemId as WizardStep))}
      aria-label="Cluster deployment wizard steps"
    >
      <NavList>
        {Object.values(WizardStep).map((v) => (
          <NavItem
            key={`clluster-wizard-steps-${_.kebabCase(v)}`}
            id={`clluster-wizard-steps-${_.kebabCase(v)}`}
            itemId={v}
            isActive={currentStep === v}
          >
            {v}
          </NavItem>
        ))}
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
