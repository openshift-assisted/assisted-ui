import axios, { AxiosPromise } from 'axios';
import { Cluster, ClusterCreateParams, Host, ClusterUpdateParams } from './types';
import { API_ROOT } from '.';

export const getCluster = (id?: string): AxiosPromise<Cluster> =>
  axios.get(`${API_ROOT}/clusters/${id}`);

// TODO(jtomasek): update useApi so that the params don't have to be optional
// useApi has params optional, but specific apiCalls require the params to be specified
export const postCluster = (params?: ClusterCreateParams): AxiosPromise<Cluster> =>
  axios.post(`${API_ROOT}/clusters`, params);

export const patchCluster = (id?: string, params?: ClusterUpdateParams): AxiosPromise<Cluster> =>
  axios.patch(`${API_ROOT}/clusters/${id}`, params);

export const deleteCluster = (id?: string): AxiosPromise<void> =>
  axios.delete(`${API_ROOT}/clusters/${id}`);

export const getClusterHosts = (id?: string): AxiosPromise<Host[]> =>
  axios.get(`${API_ROOT}/clusters/${id}/hosts`);
