import { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { createAsyncAction } from 'typesafe-actions';
import { getHosts } from '../api/hosts';
import { ListApiResponse } from '../api';
import { Host } from '../types/hosts';

export const fetchHosts = createAsyncAction(
  'GET_HOSTS_REQUEST',
  ['GET_HOSTS_SUCCESS', (response: AxiosResponse<ListApiResponse<Host>>) => response.data.items],
  ['GET_HOSTS_FAILURE', (error: Error) => error.message],
)();

// const createResourceListAsyncAction = <T>(resource: string) =>
//   createAsyncAction(
//     `GET_${resource}_REQUEST`,
//     [
//       `GET_${resource}_SUCCESS`,
//       (response: AxiosResponse<ListApiResponse<T>>) => response.data.items,
//     ],
//     [`GET_${resource}_FAILURE`, (error: Error) => error.message],
//   )();

// export const fetchHosts = createResourceListAsyncAction<Host>('HOSTS');

export const fetchHostsAsync = () => (dispatch: Dispatch) => {
  dispatch(fetchHosts.request());
  getHosts()
    .then((response) => dispatch(fetchHosts.success(response)))
    .catch(() => dispatch(fetchHosts.failure(Error('Failed to fetch hosts'))));
};
