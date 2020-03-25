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
import ClusterWizardToolbar from '../ClusterWizardToolbar';
import { ToolbarButton } from '../ui/Toolbar';
import { WizardStep } from '../../types/wizard';
import { LoadingState, ErrorState, EmptyState } from '../ui/uiState';
import { AddCircleOIcon } from '@patternfly/react-icons';
import { ResourceListUIState } from '../../types';
import { ClusterTableRows } from '../../types/clusters';
import ClustersTable from './ClustersTable';
import { fetchClustersAsync } from '../../actions/clusters';

interface ClustersProps {
  clusterRows: ClusterTableRows;
  clustersUIState: ResourceListUIState;
  clustersError: string;
  fetchClusters: () => void;
  setCurrentStep: (step: WizardStep) => void;
}

const Clusters: React.FC<ClustersProps> = ({
  fetchClusters,
  clusterRows,
  clustersUIState,
  clustersError,
  setCurrentStep,
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
            onClick={() => setCurrentStep(WizardStep.ClusterConfiguration)}
          >
            Create New Cluster
          </Button>
        }
      />
    </PageSection>
  );

  switch (clustersUIState) {
    case ResourceListUIState.LOADING:
      return loadingState;
    case ResourceListUIState.ERROR:
      return errorState;
    case ResourceListUIState.EMPTY:
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
            <ClustersTable rows={clusterRows} />
          </PageSection>
          <ClusterWizardToolbar>
            <ToolbarButton
              variant={ButtonVariant.primary}
              onClick={() => setCurrentStep(WizardStep.ClusterConfiguration)}
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

export default connect(mapStateToProps, { fetchClusters: fetchClustersAsync })(Clusters);
