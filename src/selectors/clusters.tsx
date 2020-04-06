import React from 'react';
import { createSelector } from 'reselect';

import { ClusterTableRows } from '../types/clusters';
import { Cluster, Host } from '../api/types';
import { ApiResourceKindPlural } from '../types';
import { createGetResourcesError, createGetResources, createGetResourcesUIState } from './utils';
import { Link } from 'react-router-dom';
import { IRow } from '@patternfly/react-table';
import { HostTableRows } from '../types/hosts';

export const getClustersError = createGetResourcesError(ApiResourceKindPlural.clusters);

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

export const getClusterTableRows = createSelector(
  createGetResources<Cluster>(ApiResourceKindPlural.clusters),
  (clusters): ClusterTableRows => clusters.map(clusterToClusterTableRow),
);

export const getClustersUIState = createGetResourcesUIState(ApiResourceKindPlural.clusters);

export const getClusterHosts = (cluster: Cluster) => cluster.hosts || [];

const hostToHostTableRow = (host: Host): string[] => {
  const { id, status, statusInfo } = host;
  return [id, 'Master', 'SN00000', status, statusInfo || '-', '-', '-', '-'];
};

export const getHostsTableRows = createSelector(
  getClusterHosts,
  (hosts: Host[]): HostTableRows => hosts.map(hostToHostTableRow),
);
