import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';

import * as hosts from '../actions/hosts';
import { Host } from '../models/hosts';
import { GET_HOSTS_REQUEST, GET_HOSTS_SUCCESS } from '../constants/hosts';

export type HostsActions = ActionType<typeof hosts>;

export interface HostsState {
  hosts: Host[];
  loading: boolean;
}

export default combineReducers<HostsState, HostsActions>({
  hosts: (state = [], action) => {
    switch (action.type) {
      case GET_HOSTS_REQUEST:
        return [...state];
      case GET_HOSTS_SUCCESS:
        return [...state, ...action.payload];
      default:
        return state;
    }
  },
  loading: (state = false, action) => {
    switch (action.type) {
      case GET_HOSTS_REQUEST:
        return true;
      case GET_HOSTS_SUCCESS:
        return false;
      default:
        return state;
    }
  }
});
