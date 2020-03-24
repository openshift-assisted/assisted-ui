import { Dispatch } from 'redux';
import { createAsyncAction } from 'typesafe-actions';
import { getHosts } from '../api/hosts';
import { Host } from '../types/hosts';

export const fetchHosts = createAsyncAction(
  'GET_HOSTS_REQUEST',
  'GET_HOSTS_SUCCESS',
  'GET_HOSTS_FAILURE',
)<void, Host[], string>();

export const fetchHostsAsync = () => async (dispatch: Dispatch) => {
  dispatch(fetchHosts.request());
  try {
    const { data } = await getHosts();
    return dispatch(fetchHosts.success(data));
  } catch (e) {
    console.error(e);
    return dispatch(fetchHosts.failure('Failed to fetch hosts'));
  }
};
