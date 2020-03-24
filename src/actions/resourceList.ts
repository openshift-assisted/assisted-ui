import { Dispatch } from 'redux';
import { createAction } from 'typesafe-actions';
import { getResourceList } from '../api';
import { ApiResourceKindPlural } from '../types';
import { Host } from '../types/hosts';
import { Cluster } from '../types/clusters';
import { Image } from '../types/images';

type ResourcePayload = {};

// export const fetchResourceList = createAsyncAction(
//   'GET_RESOURCE_LIST_REQUEST',
//   'GET_RESOURCE_LIST_SUCCESS',
//   'GET_RESOURCE_LIST_FAILURE',
// )<
//   ApiResourceKindPlural,
//   { [key in ApiResourceKindPlural]?: any },
//   { [key in ApiResourceKindPlural]?: string }
// >();

export const fetchResourceList = {
  request: createAction('GET_RESOURCE_LIST_REQUEST', undefined, (resource) => resource)<
    undefined,
    ApiResourceKindPlural
  >(),
  success: createAction(
    'GET_RESOURCE_LIST_SUCCESS',
    (resource: ApiResourceKindPlural, data) => data,
    (resource: ApiResourceKindPlural) => resource,
  )<Host[] | Cluster[] | Image[], ApiResourceKindPlural>(),
  failure: createAction(
    'GET_RESOURCE_LIST_ERROR',
    (resource: ApiResourceKindPlural, errorMessage: string) => errorMessage,
    (resource: ApiResourceKindPlural) => resource,
  )<string, ApiResourceKindPlural>(),
};

export const fetchResourceListAsync = <T>(
  resourceKindPlural: ApiResourceKindPlural,
  errorMessage?: string,
) => async (dispatch: Dispatch) => {
  dispatch(fetchResourceList.request(resourceKindPlural));
  try {
    const { data } = await getResourceList<T>(resourceKindPlural);
    return dispatch(fetchResourceList.success(resourceKindPlural, data as any));
  } catch (e) {
    console.error(e);
    return dispatch(
      fetchResourceList.failure(
        resourceKindPlural,
        errorMessage ? errorMessage : 'Failed to fetch data',
      ),
    );
  }
};
