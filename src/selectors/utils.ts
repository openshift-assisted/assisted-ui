import { createSelector } from 'reselect';
import { ResourceUIState, ApiResourceKindPlural } from '../types';
import { RootState } from '../store/rootReducer';
import { ApiResource } from '../types';

export const createGetResources = <T extends ApiResource>(resources: ApiResourceKindPlural) => (
  state: RootState,
) => state[resources].items as T[];

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
      if (loading) return ResourceUIState.LOADING;
      else if (error) return ResourceUIState.ERROR;
      else if (!resources.length) return ResourceUIState.EMPTY;
      else return ResourceUIState.LOADED;
    },
  );
