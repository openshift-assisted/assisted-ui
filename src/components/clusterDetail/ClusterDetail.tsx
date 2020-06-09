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
import { Cluster, Credentials } from '../../api/types';
import { getClusterCredentials } from '../../api/clusters';
import PageSection from '../ui/PageSection';
import HostsTable from '../hosts/HostsTable';
import ClusterToolbar from '../clusters/ClusterToolbar';
import { ToolbarButton } from '../ui/Toolbar';
import ClusterBreadcrumbs from '../clusters/ClusterBreadcrumbs';
import ClusterProgress from './ClusterProgress';
import ClusterCredentials from './ClusterCredentials';
import ClusterInstallationError from './ClusterInstallationError';

import './ClusterDetail.css';
import ClusterEvents from '../fetching/ClusterEvents';
import { LaunchOpenshiftConsoleButton } from './ConsoleModal';

type ClusterDetailProps = {
  cluster: Cluster;
};

const ClusterDetail: React.FC<ClusterDetailProps> = ({ cluster }) => {
  const [credentials, setCredentials] = React.useState<Credentials>();
  const [credentialsError, setCredentialsError] = React.useState();

  const fetchCredentials = React.useCallback(() => {
    const fetch = async () => {
      setCredentialsError(undefined);
      try {
        const response = await getClusterCredentials(cluster.id);
        setCredentials(response.data);
      } catch (err) {
        setCredentialsError(err);
      }
    };
    fetch();
  }, [cluster.id]);

  React.useEffect(() => {
    if (cluster.status === 'installed') {
      fetchCredentials();
    }
  }, [cluster.status, fetchCredentials]);

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
                <dt>Creation status</dt>
                <dd>
                  <ClusterProgress cluster={cluster} />
                </dd>
              </dl>
            </TextContent>
          </GridItem>
          {cluster.status === 'error' && (
            <ClusterInstallationError statusInfo={cluster.statusInfo} />
          )}
          {cluster.status === 'installed' && (
            <ClusterCredentials
              cluster={cluster}
              credentials={credentials}
              error={!!credentialsError}
              retry={fetchCredentials}
            />
          )}
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
        {cluster.status === 'installed' && (
          <LaunchOpenshiftConsoleButton
            isDisabled={!credentials || !!credentialsError}
            cluster={cluster}
            consoleUrl={credentials?.consoleUrl}
          />
        )}
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
