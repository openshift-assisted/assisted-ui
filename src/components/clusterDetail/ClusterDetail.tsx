import React from 'react';
import { Link } from 'react-router-dom';
import {
  PageSectionVariants,
  TextContent,
  Text,
  ButtonVariant,
  GridItem,
  Grid,
} from '@patternfly/react-core';
import { Cluster } from '../../api/types';
import PageSection from '../ui/PageSection';
import HostsTable from '../clusterConfiguration/HostsTable';
import ClusterToolbar from '../clusters/ClusterToolbar';
import { ToolbarButton } from '../ui/Toolbar';
import { getHumanizedDateTime } from '../ui/utils';
import ClusterBreadcrumbs from '../clusters/ClusterBreadcrumbs';
import ClusterProgress from './ClusterProgress';
import ClusterCredentials from './ClusterCredentials';
import ClusterInstallationError from './ClusterInstallationError';

import './ClusterDetail.css';
import ClusterEvents from '../fetching/ClusterEvents';

type ClusterDetailProps = {
  cluster: Cluster;
};

// TODO(jtomasek): replace this with data from cluster.progressInfo once it is available
const installationSteps = [
  'Starting Installation',
  'Bootstrapping installation',
  'Waiting for control plane',
  'Installing as master',
  'Writing image to disk',
  'Rebooting',
];

const ClusterDetail: React.FC<ClusterDetailProps> = ({ cluster }) => {
  // TODO(jtomasek): replace this with data from cluster.progressInfo once it is available
  const progressInfo = {
    steps: installationSteps,
    currentStep: cluster.statusInfo,
  };

  return (
    <>
      <ClusterBreadcrumbs clusterName={cluster.name} />
      <PageSection variant={PageSectionVariants.light} isMain>
        <Grid gutter="lg">
          <GridItem>
            <TextContent>
              <Text component="h1">{cluster.name}</Text>
            </TextContent>
          </GridItem>
          <GridItem>
            <TextContent>
              <Text component="h2">Creation Progress</Text>
              <dl className="cluster-detail__details-list">
                <dt>Creation started at</dt>
                <dd>{getHumanizedDateTime(cluster.installStartedAt)}</dd>
                <dt>Creation status</dt>
                <dd>
                  <ClusterProgress
                    status={cluster.status}
                    progressInfo={progressInfo}
                    installCompletedAt={cluster.installCompletedAt}
                  />
                </dd>
              </dl>
            </TextContent>
          </GridItem>
          {cluster.status === 'error' && (
            <ClusterInstallationError progressInfo={progressInfo} statusInfo={cluster.statusInfo} />
          )}
          {cluster.status === 'installed' && <ClusterCredentials cluster={cluster} />}
          <GridItem>
            <TextContent>
              <Text component="h2">Bare Metal Inventory</Text>
            </TextContent>
            <HostsTable cluster={cluster} />
          </GridItem>
          <GridItem>
            <TextContent>
              <Text component="h2">Cluster Events</Text>
            </TextContent>
            <ClusterEvents entityId={cluster.id} />
          </GridItem>
        </Grid>
      </PageSection>
      <ClusterToolbar>
        {
          // TODO(jtomasek): enable this when available
          /* {cluster.status === 'installing' && (
          <ToolbarButton type="button" variant={ButtonVariant.danger} isDisabled>
            Abort Installation
          </ToolbarButton>
        )} */
        }
        {/* TODO(jtomasek): enable this when available */}
        {/* {cluster.status === 'installed' && (
          <ToolbarButton type="button" variant={ButtonVariant.primary} isDisabled>
            Launch OpenShift Console
          </ToolbarButton>
        )} */}
        <ToolbarButton
          variant={ButtonVariant.link}
          component={(props) => <Link to="/clusters" {...props} />}
        >
          Close
        </ToolbarButton>
      </ClusterToolbar>
    </>
  );
};

export default ClusterDetail;
