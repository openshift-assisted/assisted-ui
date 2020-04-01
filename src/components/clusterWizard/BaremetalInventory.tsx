import React from 'react';
import { connect } from 'react-redux';
import { PageSectionVariants, Toolbar, TextVariants } from '@patternfly/react-core';

import { getHostTableRows, getHostsUIState } from '../../selectors/hosts';
import { RootState } from '../../store/rootReducer';
import PageSection from '../ui/PageSection';
import HostsTable from './HostsTable';
import { HostTableRows } from '../../types/hosts';
import ClusterWizardToolbar from './ClusterWizardToolbar';
import { ToolbarButton, ToolbarText } from '../ui/Toolbar';
import { ResourceListUIState } from '../../types';
import { fetchHostsAsync } from '../../actions/hosts';

interface BareMetalInventoryProps {
  hostRows: HostTableRows;
  hostsUIState: ResourceListUIState;
  fetchHosts: () => void;
}

const BaremetalInventory: React.FC<BareMetalInventoryProps> = ({
  fetchHosts,
  hostRows,
  hostsUIState,
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
        <HostsTable hostRows={hostRows} uiState={hostsUIState} fetchHosts={fetchHosts} />
      </PageSection>
      <ClusterWizardToolbar>
        <ToolbarButton variant="primary" isDisabled>
          Deploy Cluster
        </ToolbarButton>
        <ToolbarButton variant="secondary">Back</ToolbarButton>
        <ToolbarText component={TextVariants.small}>
          Connect at least 3 hosts to begin deployment.
        </ToolbarText>
      </ClusterWizardToolbar>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  hostRows: getHostTableRows(state),
  hostsUIState: getHostsUIState(state),
});

export default connect(mapStateToProps, { fetchHosts: fetchHostsAsync })(BaremetalInventory);
