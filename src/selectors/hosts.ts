import { createSelector } from 'reselect';

import { RootState } from '../store/rootReducer';
import { Host } from '../models/hosts';

export const getHosts = (state: RootState): Host[] => state.hosts.hosts;
export const getHostsLoading = (state: RootState): boolean =>
  state.hosts.loading;

export const getHostTableRows = createSelector(
  getHosts,
  hosts => hosts.map(host => Object.values(host))
);
