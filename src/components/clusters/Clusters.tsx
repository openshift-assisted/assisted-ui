import React from 'react';
import { connect } from 'react-redux';
import {
  PageSectionVariants,
  ButtonVariant,
  TextContent,
  Text,
  Button,
} from '@patternfly/react-core';

import { RootState } from '../../store/rootReducer';
import PageSection from '../ui/PageSection';
import {
  getClustersError,
  getClustersUIState,
  getClusterTableRows,
} from '../../selectors/clusters';
import ClusterWizardToolbar from '../clusterWizard/ClusterWizardToolbar';
import { ToolbarButton } from '../ui/Toolbar';
import { LoadingState, ErrorState, EmptyState } from '../ui/uiState';
import { AddCircleOIcon } from '@patternfly/react-icons';
import { ResourceUIState } from '../../types';
import { ClusterTableRows } from '../../types/clusters';
import ClustersTable from './ClustersTable';
import { fetchClustersAsync, deleteClusterAsync } from '../../actions/clusters';
import { Link } from 'react-router-dom';

interface ClustersProps {
  clusterRows: ClusterTableRows;
  clustersUIState: ResourceUIState;
  clustersError: string;
  fetchClusters: () => void;
  deleteCluster: (id: string) => void;
}

const Clusters: React.FC<ClustersProps> = ({
  fetchClusters,
  deleteCluster,
  clusterRows,
  clustersUIState,
  clustersError,
}) => {
  React.useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  const errorState = (
    <PageSection variant={PageSectionVariants.light} isMain>
      <ErrorState title={clustersError} fetchData={fetchClusters} />;
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
        primaryAction={
          <Button
            variant={ButtonVariant.primary}
            component={(props) => <Link to="/clusters/new" {...props} />}
          >
            Create New Cluster
          </Button>
        }
      />
    </PageSection>
  );

  switch (clustersUIState) {
    case ResourceUIState.LOADING:
      return loadingState;
    case ResourceUIState.ERROR:
      return errorState;
    case ResourceUIState.EMPTY:
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
            <ToolbarButton
              variant={ButtonVariant.primary}
              component={(props) => <Link to="/clusters/new" {...props} />}
            >
              Create New Cluster
            </ToolbarButton>
          </ClusterWizardToolbar>
        </>
      );
  }
};

const mapStateToProps = (state: RootState) => ({
  clusterRows: getClusterTableRows(state),
  clustersUIState: getClustersUIState(state),
  clustersError: getClustersError(state),
});

export default connect(mapStateToProps, {
  fetchClusters: fetchClustersAsync,
  deleteCluster: deleteClusterAsync,
})(Clusters);
