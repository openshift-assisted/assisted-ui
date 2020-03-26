import { createSelector } from 'reselect';

import { Host, HostTableRows } from '../types/hosts';
import { ApiResourceKindPlural } from '../types';
import {
  createGetResources,
  createGetResourcesUIState,
  createGetResourcesError,
} from './resources';

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
  const { id, status, namespace } = host;
  return [id, 'Master', 'SN00000', status, namespace, '-', '-', '-'];
};

export const getHostTableRows = createSelector(
  createGetResources<Host>(ApiResourceKindPlural.hosts),
  (hosts): HostTableRows => hosts.map(hostToHostTableRow),
);

export const getHostsUIState = createGetResourcesUIState(ApiResourceKindPlural.hosts);
