import { createSelector } from 'reselect';

import { RootState } from '../store/rootReducer';
import { Cluster, ClusterTableRows } from '../types/clusters';
import { ResourceListUIState } from '../types';

export const getClusters = (state: RootState): Cluster[] => state.resources.items.clusters;
export const getClustersLoading = (state: RootState): boolean => state.resources.loading.clusters;
export const getClustersError = (state: RootState): string => state.resources.error.clusters;

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
  getClusters,
  (clusters): ClusterTableRows => clusters.map(clusterToClusterTableRow),
);

export const getClustersUIState = createSelector(
  [getClustersLoading, getClustersError, getClusters],
  (loading: boolean, error: string, clusters: Cluster[]) => {
    if (loading) return ResourceListUIState.LOADING;
    else if (error) return ResourceListUIState.ERROR;
    else if (!clusters.length) return ResourceListUIState.EMPTY;
    else return ResourceListUIState.LOADED;
  },
);
