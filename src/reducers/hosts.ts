import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import * as hosts from '../actions/hosts';
import { Host } from '../types/hosts';

export type HostsActions = ActionType<typeof hosts>;

export interface HostsState {
  hosts: Host[];
  loading: boolean;
}

export default combineReducers<HostsState, HostsActions>({
  hosts: (state = [], action) => {
    switch (action.type) {
      case getType(hosts.fetchHosts.success):
        return [...action.payload];
      default:
        return state;
    }
  },
  loading: (state = false, action) => {
    switch (action.type) {
      case getType(hosts.fetchHosts.request):
        return true;
      case getType(hosts.fetchHosts.success):
      case getType(hosts.fetchHosts.failure):
        return false;
      default:
        return state;
    }
  },
});
