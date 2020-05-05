import React from 'react';
import { useSelector } from 'react-redux';
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
import { ResourceUIState } from '../../types';
import { DiscoveryImageModalButton } from './discoveryImageModal';
import { selectCurrentClusterUIState } from '../../selectors/currentCluster';

interface BareMetalInventoryProps {
  cluster: Cluster;
  setStep: React.Dispatch<React.SetStateAction<WizardStep>>;
}

const BaremetalInventory: React.FC<BareMetalInventoryProps> = ({ cluster, setStep }) => {
  const uiState = useSelector(selectCurrentClusterUIState);

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
          <Text component="h2">Bare metal inventory</Text>
          <Text component="p">
            Boot the discovery ISO on hardware that should become part of this bare metal cluster.
            Hosts connected to the internet will automatically appear below.
          </Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isMain>
        <HostsTable cluster={cluster} uiState={uiState} />
      </PageSection>
      <ClusterWizardToolbar>
        <ToolbarButton
          variant={ButtonVariant.secondary}
          component={(props) => (
            <Link to="/clusters" {...props}>
              Close
            </Link>
          )}
        ></ToolbarButton>
        <DiscoveryImageModalButton ButtonComponent={ToolbarButton} />
        <ToolbarButton
          variant={ButtonVariant.secondary}
          onClick={() => setStep(WizardStep.ClusterConfiguration)}
        >
          Next
        </ToolbarButton>
        <ToolbarText component={TextVariants.small}>
          {uiState === ResourceUIState.LOADING && 'Waiting for hosts...'}
        </ToolbarText>
      </ClusterWizardToolbar>
    </>
  );
};

export default BaremetalInventory;
