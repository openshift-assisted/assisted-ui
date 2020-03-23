import React from 'react';
import { connect } from 'react-redux';
import { PageSectionVariants, Toolbar, TextVariants } from '@patternfly/react-core';

import { fetchHostsAsync } from '../actions/hosts';
import { getHostTableRows, getHostsLoading, getHostsError } from '../selectors/hosts';
import { RootState } from '../store/rootReducer';
import PageSection from './ui/PageSection';
import HostsTable from './HostsTable';
import { HostTableRows } from '../types/hosts';
import ClusterWizardToolbar from './ClusterWizardToolbar';
import { ToolbarButton, ToolbarText } from './ui/Toolbar';
import { WizardStep } from '../types/wizard';

interface BareMetalInventoryProps {
  hostRows: HostTableRows;
  loadingHosts: boolean;
  hostsError: string;
  fetchHosts: () => void;
  setCurrentStep: (step: WizardStep) => void;
}

const BaremetalInventory: React.FC<BareMetalInventoryProps> = ({
  fetchHosts,
  hostRows,
  loadingHosts,
  hostsError,
  setCurrentStep,
}) => {
  React.useEffect(() => {
    fetchHosts();
  }, [fetchHosts]);

  return (
    <>
      <PageSection variant={PageSectionVariants.darker}>Summary stats</PageSection>
      <PageSection variant={PageSectionVariants.light}>
        <Toolbar>
          <ToolbarButton variant="primary">Add Hosts</ToolbarButton>
        </Toolbar>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isMain>
        <HostsTable
          hostRows={hostRows}
          loading={loadingHosts}
          error={hostsError}
          fetchHosts={fetchHosts}
        />
      </PageSection>
      <ClusterWizardToolbar>
        <ToolbarButton variant="primary" isDisabled>
          Deploy Cluster
        </ToolbarButton>
        <ToolbarButton variant="secondary" onClick={() => setCurrentStep(WizardStep.AccountLogin)}>
          Back
        </ToolbarButton>
        <ToolbarText component={TextVariants.small}>
          Connect at least 3 hosts to begin deployment.
        </ToolbarText>
      </ClusterWizardToolbar>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  hostRows: getHostTableRows(state),
  loadingHosts: getHostsLoading(state),
  hostsError: getHostsError(state),
});

export default connect(mapStateToProps, { fetchHosts: fetchHostsAsync })(BaremetalInventory);
