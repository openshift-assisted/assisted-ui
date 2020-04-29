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

const ClusterPage: React.FC<RouteComponentProps<MatchParams>> = ({ match }) => {
  const { clusterId } = match.params;
  const { data: cluster, uiState, forceReload } = useSelector(selectCurrentClusterState);
  const dispatch = useDispatch();

  const fetchCluster = React.useCallback(() => dispatch(fetchClusterAsync(clusterId)), [
    clusterId,
    dispatch,
  ]);
  React.useEffect(() => {
    if (forceReload) {
      dispatch(forceReloadAction(false));
      fetchCluster();
    }
    const timmer = setTimeout(() => dispatch(forceReloadAction(true)), POLLING_INTERVAL);
    return () => clearTimeout(timmer);
  }, [fetchCluster, dispatch, forceReload]);
  React.useEffect(() => {
    dispatch(forceReloadAction(true));
    return () => {
      dispatch(forceReloadAction(false));
      dispatch(cleanCluster());
    };
  }, [dispatch]);

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
