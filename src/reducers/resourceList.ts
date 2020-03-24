import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

// import * as actions from '../actions/resourceList';
import * as actions from '../actions/resourceList';
import { Host } from '../types/hosts';
import { Cluster } from '../types/clusters';
import { Image } from '../types/images';
import { ApiResourceKindPlural } from '../types';

export type ResourceListActions = ActionType<typeof actions>;

export type ResourceListItems = {
  [ApiResourceKindPlural.clusters]: Cluster[];
  [ApiResourceKindPlural.images]: Image[];
  [ApiResourceKindPlural.hosts]: Host[];
};

export type ResourceListError = {
  [key in ApiResourceKindPlural]: string;
};

export type ResourceListLoading = {
  [key in ApiResourceKindPlural]: boolean;
};

export interface ResourceListState {
  items: ResourceListItems;
  error: ResourceListError;
  loading: ResourceListLoading;
}

const initialItemsState = {
  [ApiResourceKindPlural.clusters]: [],
  [ApiResourceKindPlural.images]: [],
  [ApiResourceKindPlural.hosts]: [],
};

const initialErrorState = {
  [ApiResourceKindPlural.clusters]: '',
  [ApiResourceKindPlural.images]: '',
  [ApiResourceKindPlural.hosts]: '',
};

const initialLoadingState = {
  [ApiResourceKindPlural.clusters]: true,
  [ApiResourceKindPlural.images]: true,
  [ApiResourceKindPlural.hosts]: true,
};

export default combineReducers<ResourceListState, ResourceListActions>({
  items: (state = initialItemsState, { type, payload, meta }) => {
    switch (type) {
      case getType(actions.fetchResourceList.success):
        // return [...action.payload];
        return { ...state, ...{ [meta]: payload } };
      default:
        return state;
    }
  },
  error: (state = initialErrorState, { type, payload, meta }) => {
    switch (type) {
      case getType(actions.fetchResourceList.request):
      case getType(actions.fetchResourceList.success):
        return { ...state, ...{ [meta]: '' } };
      case getType(actions.fetchResourceList.failure):
        return { ...state, ...{ [meta]: payload } };
      default:
        return state;
    }
  },
  loading: (state = initialLoadingState, { type, meta }) => {
    switch (type) {
      case getType(actions.fetchResourceList.request):
        return { ...state, ...{ [meta]: true } };
      case getType(actions.fetchResourceList.success):
      case getType(actions.fetchResourceList.failure):
        return { ...state, ...{ [meta]: false } };
      default:
        return state;
    }
  },
});
