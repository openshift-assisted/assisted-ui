import { Dispatch } from 'redux';
import { createAsyncAction } from 'typesafe-actions';
import { getResourceList } from '../api';
import { ApiResourceKindPlural } from '../types';
import { Cluster } from '../types/clusters';

export const fetchClusters = createAsyncAction(
  'GET_CLUSTERS_REQUEST',
  'GET_CLUSTERS_SUCCESS',
  'GET_CLUSTERS_FAILURE',
)<void, Cluster[], string>();

export const fetchClustersAsync = () => async (dispatch: Dispatch) => {
  dispatch(fetchClusters.request());
  try {
    const { data } = await getResourceList<Cluster>(ApiResourceKindPlural.clusters);
    return dispatch(fetchClusters.success(data));
  } catch (e) {
    console.error(e);
    return dispatch(fetchClusters.failure('Failed to fetch clusters'));
  }
};
