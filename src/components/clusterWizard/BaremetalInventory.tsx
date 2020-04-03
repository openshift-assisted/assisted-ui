import React from 'react';
import {
  ButtonVariant,
  Breadcrumb,
  BreadcrumbItem,
  PageSectionVariants,
  TextVariants,
  Text,
  TextContent,
} from '@patternfly/react-core';

import PageSection from '../ui/PageSection';
import HostsTable from './HostsTable';
import ClusterWizardToolbar from './ClusterWizardToolbar';
import { ToolbarButton, ToolbarText } from '../ui/Toolbar';
import { Cluster } from '../../api/types';
import { Link } from 'react-router-dom';
import { WizardStep } from '../../types/wizard';
import { getClusterHosts } from '../../api/clusters';
import useApi from '../../api/useApi';
import { ResourceUIState } from '../../types';
import { DiscoveryImageModalButton } from './discoveryImageModal';

interface BareMetalInventoryProps {
  cluster: Cluster;
  setStep: React.Dispatch<React.SetStateAction<WizardStep>>;
}

const BaremetalInventory: React.FC<BareMetalInventoryProps> = ({ cluster, setStep }) => {
  const [{ data: hosts, uiState }, fetchHosts] = useApi(getClusterHosts, cluster.id, {
    manual: true,
    initialUIState: cluster.hosts?.length ? ResourceUIState.LOADED : ResourceUIState.EMPTY,
  });

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
        <HostsTable hosts={hosts || cluster.hosts} uiState={uiState} fetchHosts={fetchHosts} />
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
        <DiscoveryImageModalButton ButtonComponent={ToolbarButton} />
        <ToolbarButton variant={ButtonVariant.secondary} onClick={() => fetchHosts()}>
          Reload Hosts
        </ToolbarButton>
        <ToolbarButton
          variant={ButtonVariant.secondary}
          onClick={() => setStep(WizardStep.ClusterConfiguration)}
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

export default BaremetalInventory;
