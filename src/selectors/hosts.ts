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

const hostsValuesSelector = state => state.hosts.items;

export const hostsAggregateValues = createSelector(
  hostsValuesSelector,
  items => items.reduce((acc, item) => acc + item.memory, 0)
);

let exampleState = {
  hosts: {
    memory: 8,
    items: [{ name: 'test1', memory: 3 }, { name: 'test2', memory: 4 }]
  }
};

console.log(hostsAggregateValues(exampleState));
