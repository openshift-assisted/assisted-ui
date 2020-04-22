import { Dispatch } from 'redux';
import { createAsyncAction } from 'typesafe-actions';
import { Host } from '../api/types';
import { ApiResourceKindPlural } from '../types';
import { getResourceList } from '../api';

export const fetchHosts = createAsyncAction(
  'GET_HOSTS_REQUEST',
  'GET_HOSTS_SUCCESS',
  'GET_HOSTS_FAILURE',
)<void, Host[], string>();

export const fetchHostsAsync = () => async (dispatch: Dispatch) => {
  dispatch(fetchHosts.request());
  try {
    const { data } = await getResourceList<Host>(ApiResourceKindPlural.hosts);
    return dispatch(fetchHosts.success(data));
  } catch (e) {
    console.error(e);
    return dispatch(fetchHosts.failure('Failed to fetch hosts'));
  }
};
