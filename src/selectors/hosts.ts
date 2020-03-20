import { createSelector } from 'reselect';

import { RootState } from '../store/rootReducer';
import { Host, HostTableRows } from '../types/hosts';

export const getHosts = (state: RootState): Host[] => state.hosts.hosts;
export const getHostsLoading = (state: RootState): boolean => state.hosts.loading;
export const getHostsError = (state: RootState): string => state.hosts.error;

const hostToHostTableRow = (host: Host): string[] => {
  const { spec = {}, status = {} } = host;
  return [
    host.metadata.name,
    spec.bmc.ip,
    spec.online ? 'Online' : 'Offline',
    status.hardware.cpus.length.toString(),
    status.hardware.ramGiB.toString(),
    status.hardware.storage[0].sizeGiB.toString(),
    'Master',
  ];
};

export const getHostTableRows = createSelector(
  getHosts,
  (hosts): HostTableRows => hosts.map(hostToHostTableRow),
);
