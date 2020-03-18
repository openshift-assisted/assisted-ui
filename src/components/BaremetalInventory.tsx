import React from 'react';
import { connect } from 'react-redux';
import { PageSectionVariants, Toolbar, TextVariants } from '@patternfly/react-core';

import { fetchHostsAsync } from '../actions/hosts';
import { getHostTableRows, getHostsLoading } from '../selectors/hosts';
import { RootState } from '../store/rootReducer';
import PageSection from './ui/PageSection';
import HostsTable from './HostsTable';
import { HostTableRows } from '../models/hosts';
import ClusterWizardToolbar from './ClusterWizardToolbar';
import { ToolbarButton, ToolbarText } from './ui/Toolbar';
import { WizardStep } from '../models/wizard';

interface BareMetalInventoryProps {
  hostRows: HostTableRows;
  loadingHosts: boolean;
  fetchHosts: () => void;
  setCurrentStep: (step: WizardStep) => void;
}

const BaremetalInventory: React.FC<BareMetalInventoryProps> = ({
  fetchHosts,
  hostRows,
  loadingHosts,
  setCurrentStep,
}) => {
  React.useEffect(() => fetchHosts(), [fetchHosts]);

  return (
    <>
      <PageSection variant={PageSectionVariants.darker}>Summary stats</PageSection>
      <PageSection variant={PageSectionVariants.light}>
        <Toolbar>
          <ToolbarButton variant="primary">Add Hosts</ToolbarButton>
        </Toolbar>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isMain noPadding>
        <HostsTable hostRows={hostRows} loadingHosts={loadingHosts} />
      </PageSection>
      <ClusterWizardToolbar>
        <ToolbarButton variant="primary" isDisabled>
          Deploy Cluster
        </ToolbarButton>
        <ToolbarButton variant="secondary" onClick={() => setCurrentStep(WizardStep.ClusterSetup)}>
          Back
        </ToolbarButton>
        <ToolbarText component={TextVariants.small}>
          Connect at least 3 hosts to begin deployment.
        </ToolbarText>
      </ClusterWizardToolbar>
    </>
  );
};

const mapStateToProps = (state: RootState): { hostRows: HostTableRows; loadingHosts: boolean } => ({
  hostRows: getHostTableRows(state),
  loadingHosts: getHostsLoading(state),
});

export default connect(mapStateToProps, { fetchHosts: fetchHostsAsync })(BaremetalInventory);
