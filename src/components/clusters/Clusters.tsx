import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PageSectionVariants,
  TextContent,
  Text,
  TextVariants,
  Spinner,
} from '@patternfly/react-core';
import PageSection from '../ui/PageSection';
import { selectClusterTableRows, selectClustersUIState } from '../../selectors/clusters';
import ClusterWizardToolbar from '../clusterWizard/ClusterWizardToolbar';
import { ToolbarText, ToolbarButton } from '../ui/Toolbar';
import { LoadingState, ErrorState, EmptyState } from '../ui/uiState';
import { AddCircleOIcon } from '@patternfly/react-icons';
import { ResourceUIState } from '../../types';
import ClustersTable from './ClustersTable';
import { deleteClusterAsync, fetchClustersAsync } from '../../features/clusters/clustersSlice';
import { NewClusterModalButton } from './newClusterModal';

const Clusters: React.FC = () => {
  const clusterRows = useSelector(selectClusterTableRows);
  const clustersUIState = useSelector(selectClustersUIState);
  const dispatch = useDispatch();
  const fetchClusters = React.useCallback(() => dispatch(fetchClustersAsync()), [dispatch]);
  const deleteCluster = React.useCallback((clusterId) => dispatch(deleteClusterAsync(clusterId)), [
    dispatch,
  ]);

  React.useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  const errorState = (
    <PageSection variant={PageSectionVariants.light} isMain>
      <ErrorState title="Failed to fetch clusters." fetchData={fetchClusters} />;
    </PageSection>
  );
  const loadingState = (
    <PageSection variant={PageSectionVariants.light} isMain>
      <LoadingState />
    </PageSection>
  );
  const emptyState = (
    <PageSection variant={PageSectionVariants.light} isMain>
      <EmptyState
        icon={AddCircleOIcon}
        title="Create new bare metal cluster"
        content="There are no clusters yet. This wizard is going to guide you through the OpenShift bare metal cluster deployment."
        primaryAction={<NewClusterModalButton />}
      />
    </PageSection>
  );

  const { LOADING, EMPTY, ERROR, RELOADING } = ResourceUIState;
  switch (clustersUIState) {
    case LOADING:
      return loadingState;
    case ERROR:
      return errorState;
    case EMPTY:
      return emptyState;
    default:
      // TODO(jtomasek): if there is just one cluster, redirect to it's detail
      return (
        <>
          <PageSection variant={PageSectionVariants.light}>
            <TextContent>
              <Text component="h1">Managed Clusters</Text>
            </TextContent>
          </PageSection>
          <PageSection variant={PageSectionVariants.light} isMain>
            <ClustersTable rows={clusterRows} deleteCluster={deleteCluster} />
          </PageSection>
          <ClusterWizardToolbar>
            <NewClusterModalButton ButtonComponent={ToolbarButton} />
            <ToolbarText component={TextVariants.small}>
              {clustersUIState === RELOADING && (
                <>
                  <Spinner size="sm" /> Fetching clusters...
                </>
              )}
            </ToolbarText>
          </ClusterWizardToolbar>
        </>
      );
  }
};

export default Clusters;
