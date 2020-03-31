import { createSelector } from 'reselect';

import { HostTableRows } from '../types/hosts';
import { Host } from '../api/types';
import { ApiResourceKindPlural } from '../types';
import { createGetResources, createGetResourcesUIState, createGetResourcesError } from './utils';

export const getHostsError = createGetResourcesError(ApiResourceKindPlural.hosts);

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
  const { id, status } = host;
  return [id, 'Master', 'SN00000', status, '-', '-', '-'];
};

export const getHostTableRows = createSelector(
  createGetResources<Host>(ApiResourceKindPlural.hosts),
  (hosts): HostTableRows => hosts.map(hostToHostTableRow),
);

export const getHostsUIState = createGetResourcesUIState(ApiResourceKindPlural.hosts);
