import React from 'react';
import { createSelector } from 'reselect';

import { Cluster, ClusterTableRows } from '../types/clusters';
import { ApiResourceKindPlural } from '../types';
import { createGetResourcesError, createGetResources, createGetResourcesUIState } from './utils';
import { Link } from 'react-router-dom';
import { IRow } from '@patternfly/react-table';

export const getClustersError = createGetResourcesError(ApiResourceKindPlural.clusters);

const clusterToClusterTableRow = (cluster: Cluster): IRow => {
  const { id, name, status, namespace, hosts } = cluster;
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
      namespace,
    ],
  };
};

export const getClusterTableRows = createSelector(
  createGetResources<Cluster>(ApiResourceKindPlural.clusters),
  (clusters): ClusterTableRows => clusters.map(clusterToClusterTableRow),
);

export const getClustersUIState = createGetResourcesUIState(ApiResourceKindPlural.clusters);
