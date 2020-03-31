import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { PageSectionVariants, ButtonVariant, Button } from '@patternfly/react-core';
import PageSection from '../ui/PageSection';
import { ErrorState, LoadingState } from '../ui/uiState';
import { getCluster } from '../../api/clusters';
import { Cluster } from '../../api/types';

type MatchParams = {
  clusterId: string;
};

const ClusterPage: React.FC<RouteComponentProps<MatchParams>> = ({ match }) => {
  const { clusterId } = match.params;
  const [uiState, setUiState] = React.useState('loading');
  const [cluster, setCluster] = React.useState<Cluster>();

  const fetchClusterAsync = async (clusterId: string) => {
    try {
      setUiState('loading');
      const { data } = await getCluster(clusterId);
      setCluster(data);
      setUiState('done');
    } catch (e) {
      setUiState('error');
      console.error(e);
      console.error(e.response?.data);
    }
  };

  useEffect(() => {
    fetchClusterAsync(clusterId);
  }, [clusterId]);

  const cancel = (
    <Button
      key="cancel"
      variant={ButtonVariant.secondary}
      component={(props) => <Link to="/clusters" {...props} />}
    >
      Cancel
    </Button>
  );

  const errorState = (
    <PageSection variant={PageSectionVariants.light} isMain>
      <ErrorState
        title={'Failed to fetch the cluster'}
        fetchData={() => fetchClusterAsync(clusterId)}
        actions={[cancel]}
      />
    </PageSection>
  );
  const loadingState = (
    <PageSection variant={PageSectionVariants.light} isMain>
      <LoadingState />
    </PageSection>
  );

  if (uiState === 'loading') return loadingState;
  if (uiState === 'error') return errorState;
  return <PageSection isMain>{JSON.stringify(cluster, null, 2)}</PageSection>;
};

export default ClusterPage;
