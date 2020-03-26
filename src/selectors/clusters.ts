import { createSelector } from 'reselect';

import { Cluster, ClusterTableRows } from '../types/clusters';
import { ApiResourceKindPlural } from '../types';
import { createGetResourcesError, createGetResources, createGetResourcesUIState } from './utils';

export const getClustersError = createGetResourcesError(ApiResourceKindPlural.clusters);

const clusterToClusterTableRow = (cluster: Cluster): string[] => {
  // const { spec = {}, status = {} } = host;
  // return [
  //   host.metadata.name,
  //   spec.bmc.ip,
  //   spec.online ? 'Online' : 'Offline',
  //   status.hardware.cpus.length.toString(),
  //   status.hardware.ramGiB.toString(),
  //   status.hardware.storage[0].sizeGiB.toString(),
  //   'Master',
  // ];
  const { id, name, status, namespace, hosts } = cluster;
  return [name, id, status, hosts.length.toString(), namespace];
};

export const getClusterTableRows = createSelector(
  createGetResources<Cluster>(ApiResourceKindPlural.clusters),
  (clusters): ClusterTableRows => (clusters as Cluster[]).map(clusterToClusterTableRow),
);

export const getClustersUIState = createGetResourcesUIState(ApiResourceKindPlural.clusters);
