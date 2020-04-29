import React from 'react';
import { createSelector } from 'reselect';

import { ClusterTableRows } from '../types/clusters';
import { Cluster } from '../api/types';
import { ResourceUIState } from '../types';
import { Link } from 'react-router-dom';
import { IRow } from '@patternfly/react-table';
import { RootState } from '../store/rootReducer';

const selectClusters = (state: RootState) => state.clusters.data;
const clustersUIState = (state: RootState) => state.clusters.uiState;

export const selectClustersUIState = createSelector(
  [selectClusters, clustersUIState],
  (clusters, uiState): ResourceUIState => {
    const { LOADED, EMPTY } = ResourceUIState;
    return !clusters.length && uiState === LOADED ? EMPTY : uiState;
  },
);

const clusterToClusterTableRow = (cluster: Cluster): IRow => {
  const { id, name, status, hosts } = cluster;
  return {
    cells: [
      {
        title: (
          <Link key={name} to={`/clusters/${id}`}>
            {name}
          </Link>
        ),
      },
      id,
      status,
      hosts ? hosts.length.toString() : '0',
    ],
  };
};

export const selectClusterTableRows = createSelector(
  selectClusters,
  (clusters): ClusterTableRows => clusters.map(clusterToClusterTableRow),
);
