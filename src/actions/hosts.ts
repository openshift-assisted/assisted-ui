import { Dispatch } from 'redux';
import { createAsyncAction } from 'typesafe-actions';
import { getHosts } from '../api/hosts';
import { getIntrospectionData } from '../api/introspectionData';
import { Host } from '../models/hosts';
import { IntrospectionData } from '../models/introspectionData';

export const fetchHosts = createAsyncAction(
  'GET_HOSTS_REQUEST',
  'GET_HOSTS_SUCCESS',
  'GET_HOSTS_FAILURE'
)<void, Host[], Error>();

export const fetchIntrospectionData = createAsyncAction(
  'GET_INTROSPECTION_DATA_REQUEST',
  'GET_INTROSPECTION_DATA_SUCCESS',
  'GET_INTROSPECTION_DATA_FAILURE'
)<string, IntrospectionData, Error>();

export const fetchHostsAsync = (): ((dispatch: Dispatch) => void) => (
  dispatch: Dispatch
) => {
  dispatch(fetchHosts.request());
  getHosts()
    .then(response => {
      dispatch(fetchHosts.success(response.data.data));
      for (let host of response.data.data) {
        dispatch(fetchIntrospectionData.request(host.name));
        getIntrospectionData(host.name)
          .then(response => {
            dispatch(fetchIntrospectionData.success(response.data.data));
          })
          .catch(() =>
            dispatch(
              fetchIntrospectionData.failure(
                Error(`Failed to get introspection data for host ${host.name}`)
              )
            )
          );
      }
    })
    .catch(() => dispatch(fetchHosts.failure(Error('Failed to fetch hosts'))));
};
