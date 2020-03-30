import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';
import _ from 'lodash';
import * as actions from '../actions/clusters';
import { Cluster } from '../types/clusters';
import { ResourceState } from './types';

export type ClustersActions = ActionType<typeof actions>;

export default combineReducers<ResourceState<Cluster>, ClustersActions>({
  items: (state = [], action) => {
    switch (action.type) {
      case getType(actions.deleteClusterActions.success):
        return _.filter(state, (item: Cluster) => item.id !== action.payload);
      case getType(actions.fetchClusters.success):
        return [...action.payload];
      default:
        return state;
    }
  },
  error: (state = '', action) => {
    switch (action.type) {
      case getType(actions.fetchClusters.request):
      case getType(actions.fetchClusters.success):
        return '';
      case getType(actions.fetchClusters.failure):
        return action.payload;
      default:
        return state;
    }
  },
  loading: (state = true, action) => {
    switch (action.type) {
      case getType(actions.fetchClusters.request):
        return true;
      case getType(actions.fetchClusters.success):
      case getType(actions.fetchClusters.failure):
        return false;
      default:
        return state;
    }
  },
});
