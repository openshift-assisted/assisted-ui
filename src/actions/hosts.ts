import * as redux from 'redux';
import { action } from 'typesafe-actions';
import {
  GET_HOSTS_REQUEST,
  GET_HOSTS_SUCCESS,
  GET_HOSTS_FAILURE
} from '../constants/hosts';
import { ReduxAction } from './index';
import * as hostsApi from '../api/hosts';
import { Host } from '../models/hosts';

// NOTE: this is just an example for now

interface HostListApiResponse {
  data: Host[];
}

export const getHosts = (): ReduxAction<void> => action(GET_HOSTS_REQUEST);
export const getHostsSuccess = (
  data: HostListApiResponse
): ReduxAction<Host[]> => action(GET_HOSTS_SUCCESS, data.data);

export const getHostsFailure = (): ReduxAction<void> =>
  action(GET_HOSTS_FAILURE);

export const getHostsAsync = (): ((dispatch: redux.Dispatch) => void) => (
  dispatch: redux.Dispatch
) => {
  dispatch(getHosts());
  hostsApi
    .getHosts()
    .then(response => {
      dispatch(getHostsSuccess(response.data));
    })
    .catch(() => {
      dispatch(getHostsFailure());
    });
};
