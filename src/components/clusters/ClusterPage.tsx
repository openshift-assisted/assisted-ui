import React from 'react';
import { Link, RouteComponentProps, Redirect } from 'react-router-dom';
import { PageSectionVariants, ButtonVariant, Button } from '@patternfly/react-core';
import { useSelector, useDispatch } from 'react-redux';
import PageSection from '../ui/PageSection';
import { ErrorState, LoadingState } from '../ui/uiState';
import ClusterWizard from '../clusterWizard/ClusterWizard';
import { ResourceUIState } from '../../types';
import { selectCurrentClusterState } from '../../selectors/currentCluster';
import {
  fetchClusterAsync,
  cleanCluster,
  forceReload as forceReloadAction,
} from '../../features/clusters/currentClusterSlice';
import { POLLING_INTERVAL } from '../../config/constants';

type MatchParams = {
  clusterId: string;
};

const useFetchCluster = (clusterId: string) => {
  const dispatch = useDispatch();
  return React.useCallback(() => dispatch(fetchClusterAsync(clusterId)), [clusterId, dispatch]);
};

const useClusterPolling = (clusterId: string) => {
  const { forceReload, uiState } = useSelector(selectCurrentClusterState);
  const dispatch = useDispatch();
  const fetchCluster = useFetchCluster(clusterId);

  React.useEffect(() => {
    if (forceReload) {
      if (![ResourceUIState.LOADING, ResourceUIState.RELOADING].includes(uiState)) {
        fetchCluster();
      }
    }
    dispatch(forceReloadAction(false));
  }, [fetchCluster, dispatch, forceReload, uiState]);

  React.useEffect(() => {
    fetchCluster();
    const timmer = setInterval(() => dispatch(forceReloadAction(true)), POLLING_INTERVAL);
    return () => {
      clearInterval(timmer);
      dispatch(forceReloadAction(false));
      dispatch(cleanCluster());
    };
  }, [dispatch, fetchCluster]);
};

const ClusterPage: React.FC<RouteComponentProps<MatchParams>> = ({ match }) => {
  const { clusterId } = match.params;
  const { data: cluster, uiState } = useSelector(selectCurrentClusterState);
  const fetchCluster = useFetchCluster(clusterId);
  useClusterPolling(clusterId);

  const cancel = (
    <Button
      key="cancel"
      variant={ButtonVariant.secondary}
      component={(props) => <Link to="/clusters" {...props} />}
    >
      Back
    </Button>
  );

  const errorState = (
    <PageSection variant={PageSectionVariants.light} isMain>
      <ErrorState
        title={'Failed to fetch the cluster'}
        fetchData={fetchCluster}
        actions={[cancel]}
      />
    </PageSection>
  );
  const loadingState = (
    <PageSection variant={PageSectionVariants.light} isMain>
      <LoadingState />
    </PageSection>
  );

  if (uiState === ResourceUIState.LOADING) return loadingState;
  if (uiState === ResourceUIState.ERROR) return errorState; // TODO(jtomasek): redirect to cluster list instead?
  // TODO(jtomasek): handle cases when cluster is not-deployed/deploying/deployed
  if (cluster) return <ClusterWizard cluster={cluster} />;
  return <Redirect to="/clusters" />;
};

export default ClusterPage;
