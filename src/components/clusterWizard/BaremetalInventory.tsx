import React from 'react';
import { connect } from 'react-redux';
import {
  ButtonVariant,
  Breadcrumb,
  BreadcrumbItem,
  PageSectionVariants,
  TextVariants,
  Text,
  TextContent,
} from '@patternfly/react-core';

import { getHostTableRows, getHostsUIState } from '../../selectors/hosts';
import { RootState } from '../../store/rootReducer';
import PageSection from '../ui/PageSection';
import HostsTable from './HostsTable';
import { HostTableRows } from '../../types/hosts';
import ClusterWizardToolbar from './ClusterWizardToolbar';
import { ToolbarButton, ToolbarText } from '../ui/Toolbar';
import { ResourceUIState } from '../../types';
import { fetchHostsAsync } from '../../actions/hosts';
import { Cluster } from '../../api/types';
import { Link } from 'react-router-dom';
import { WizardStep } from '../../types/wizard';
import { getClusterHosts } from '../../api/clusters';
import useApi from '../../api/useApi';

interface BareMetalInventoryProps {
  cluster: Cluster;
  setStep: React.Dispatch<React.SetStateAction<WizardStep>>;
  hostRows: HostTableRows;
  hostsUIState: ResourceUIState;
}

const BaremetalInventory: React.FC<BareMetalInventoryProps> = ({
  cluster,
  setStep,
  hostRows,
  hostsUIState,
}) => {
  const [{ data: hosts, uiState }, fetchHosts] = useApi(getClusterHosts, cluster.id);
  // const fetchHosts = useApi(() => getClusterHosts(cluster.id));
  // console.log(state);

  // const [uiState, setUIState] = React.useState('loading');
  // const [error, setError] = React.useState('');
  // React.useEffect(() => {
  //   setUIState('loading');
  //   setError('');
  //   try {
  //     const { data } = await getClusterHosts(cluster.id);
  //     setUIState('done');
  //   } catch (e) {
  //     console.error(e);
  //     return dispatch(fetchHosts.failure('Failed to fetch hosts'));
  //   }
  // }, [fetchHosts]);

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/clusters">Clusters</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{cluster.name}</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h2">Bare Metal Hosts</Text>
          <Text component="p">
            Boot the discovery ISO on hosts that are connected to the internet. At least 3 hosts are
            required to create a cluster.
          </Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isMain>
        <HostsTable hostRows={hostRows} uiState={uiState} fetchHosts={fetchHosts} />
      </PageSection>
      <ClusterWizardToolbar>
        <ToolbarButton
          variant={ButtonVariant.secondary}
          component={(props) => (
            <Link to="/clusters" {...props}>
              Cancel
            </Link>
          )}
        ></ToolbarButton>
        <ToolbarButton variant={ButtonVariant.primary}>Download discovery ISO</ToolbarButton>
        <ToolbarButton
          variant={ButtonVariant.secondary}
          // onClick={() => setStep(WizardStep.ClusterConfiguration)}
          onClick={() => fetchHosts()}
        >
          Next
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
  hostsUIState: getHostsUIState(state),
});

export default connect(mapStateToProps, { fetchHosts: fetchHostsAsync })(BaremetalInventory);
