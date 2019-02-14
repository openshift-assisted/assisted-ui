import { HostsState } from '../reducers/hosts';

export const getHostTableRows = (state: HostsState): string[][] =>
  state.hosts.map(host => Object.values(host));
export const getHostsLoading = (state: HostsState): boolean => state.loading;
