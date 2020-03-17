import { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { createAsyncAction } from 'typesafe-actions';
import { getHosts } from '../api/hosts';
import { K8sListApiResponse } from '../api';
import { Host } from '../models/hosts';

export const fetchHosts = createAsyncAction(
  ['GET_HOSTS_REQUEST', undefined],
  ['GET_HOSTS_SUCCESS', (response: AxiosResponse<K8sListApiResponse<Host>>) => response.data.items],
  ['GET_HOSTS_FAILURE', (error: Error) => error.message],
)();
// )<void, Host[], Error, undefined>();

export const fetchHostsAsync = () => (dispatch: Dispatch) => {
  dispatch(fetchHosts.request());
  getHosts()
    // .then((response) => dispatch(fetchHosts.success(response)))
    .then((response) => dispatch(fetchHosts.success(response)))
    .catch(() => dispatch(fetchHosts.failure(Error('Failed to fetch hosts'))));
};
