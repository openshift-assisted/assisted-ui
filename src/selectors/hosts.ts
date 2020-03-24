import { createSelector } from 'reselect';

import { RootState } from '../store/rootReducer';
import { Host, HostTableRows } from '../types/hosts';
import { ResourceListUIState } from '../types';

export const getHosts = (state: RootState): Host[] => state.resources.items.hosts;
export const getHostsLoading = (state: RootState): boolean => state.resources.loading.hosts;
export const getHostsError = (state: RootState): string => state.resources.error.hosts;

const hostToHostTableRow = (host: Host): string[] => {
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
  const { id, status, namespace } = host;
  return [id, 'Master', 'SN00000', status, namespace, '-', '-', '-'];
};

export const getHostTableRows = createSelector(
  getHosts,
  (hosts): HostTableRows => hosts.map(hostToHostTableRow),
);

export const getHostsUIState = createSelector(
  [getHostsLoading, getHostsError, getHosts],
  (loading: boolean, error: string, hosts: Host[]) => {
    if (loading) return ResourceListUIState.LOADING;
    else if (error) return ResourceListUIState.ERROR;
    else if (!hosts.length) return ResourceListUIState.EMPTY;
    else return ResourceListUIState.LOADED;
  },
);
