import { createSelector } from 'reselect';
import { ResourceListUIState, ApiResourceKindPlural } from '../types';
import { RootState } from '../store/rootReducer';

export const createGetResources = (resources: ApiResourceKindPlural) => (state: RootState) =>
  state[resources].items;

export const createGetResourcesLoading = (resources: ApiResourceKindPlural) => (state: RootState) =>
  state[resources].loading;

export const createGetResourcesError = (resources: ApiResourceKindPlural) => (state: RootState) =>
  state[resources].error;

export const createGetResourcesUIState = (resources: ApiResourceKindPlural) =>
  createSelector(
    [
      createGetResourcesLoading(resources),
      createGetResourcesError(resources),
      createGetResources(resources),
    ],
    (loading, error, resources) => {
      if (loading) return ResourceListUIState.LOADING;
      else if (error) return ResourceListUIState.ERROR;
      else if (!resources.length) return ResourceListUIState.EMPTY;
      else return ResourceListUIState.LOADED;
    },
  );
