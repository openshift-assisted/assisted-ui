import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import * as hosts from '../actions/hosts';
import { Host } from '../api/types';
import { ResourceState } from './types';

export type HostsActions = ActionType<typeof hosts>;

export default combineReducers<ResourceState<Host>, HostsActions>({
  items: (state = [], action) => {
    switch (action.type) {
      case getType(hosts.fetchHosts.success):
        return [...action.payload];
      default:
        return state;
    }
  },
  error: (state = '', action) => {
    switch (action.type) {
      case getType(hosts.fetchHosts.request):
      case getType(hosts.fetchHosts.success):
        return '';
      case getType(hosts.fetchHosts.failure):
        return action.payload;
      default:
        return state;
    }
  },
  loading: (state = true, action) => {
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
