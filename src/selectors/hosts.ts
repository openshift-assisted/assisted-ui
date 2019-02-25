import { createSelector } from 'reselect';

import { RootState } from '../store/rootReducer';
import { Host } from '../models/hosts';

export const getHosts = (state: RootState): Host[] => state.hosts.hosts;
export const getHostsLoading = (state: RootState): boolean =>
  state.hosts.loading;

const hostToHostTableRow = (host: Host): string[] => {
  const spec = host.spec ? host.spec : {};
  const status = host.status ? host.status : {};
  return [
    host.metadata.name,
    spec.bmc.ip,
    spec.online ? 'Online' : 'Offline',
    status.hardware.cpus.length.toString(),
    status.hardware.ramGiB.toString(),
    status.hardware.storage[0].sizeGiB.toString(),
    'Master'
  ];
};

export const getHostTableRows = createSelector(
  getHosts,
  hosts => hosts.map(hostToHostTableRow)
);
