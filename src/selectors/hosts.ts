import { HostsState } from '../reducers/hosts';
import { Host } from '../models/hosts';

export const getHostList = (state: HostsState): Host[] => state.hosts;
export const getHostsLoading = (state: HostsState): boolean => state.loading;
