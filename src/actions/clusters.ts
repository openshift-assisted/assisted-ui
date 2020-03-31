import { Dispatch } from 'redux';
import { createAsyncAction } from 'typesafe-actions';
import { getResourceList } from '../api';
import { deleteCluster } from '../api/clusters';
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

export const deleteClusterActions = createAsyncAction(
  'DELETE_CLUSTER_REQUEST',
  'DELETE_CLUSTER_SUCCESS',
  'DELETE_CLUSTER_FAILURE',
)<void, string, string>();

export const deleteClusterAsync = (id: string) => async (dispatch: Dispatch) => {
  dispatch(deleteClusterActions.request());
  try {
    await deleteCluster(id);
    return dispatch(deleteClusterActions.success(id));
  } catch (e) {
    console.error(e);
    return dispatch(deleteClusterActions.failure('Failed to delete cluster'));
  }
};
