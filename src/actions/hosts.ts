import { Dispatch } from 'redux';
import { createAsyncAction } from 'typesafe-actions';
import { getHosts } from '../api/hosts';
import { Host } from '../types/hosts';

export const fetchHosts = createAsyncAction(
  'GET_HOSTS_REQUEST',
  'GET_HOSTS_SUCCESS',
  'GET_HOSTS_FAILURE',
)<void, Host[], string>();

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
    .then((response) => dispatch(fetchHosts.success(response.data)))
    .catch((e) => {
      console.error(e);
      return dispatch(fetchHosts.failure('Failed to fetch hosts'));
    });
};
