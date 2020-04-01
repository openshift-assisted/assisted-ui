import axios, { AxiosPromise } from 'axios';
import { Cluster, ClusterCreateParams, Host } from './types';
import { API_ROOT } from '.';

export const createCluster = (params: ClusterCreateParams): AxiosPromise<Cluster> =>
  axios.post(`${API_ROOT}/clusters`, params);

export const getCluster = (id: string): AxiosPromise<Cluster> =>
  axios.get(`${API_ROOT}/clusters/${id}`);

export const deleteCluster = (id: string): AxiosPromise<void> =>
  axios.delete(`${API_ROOT}/clusters/${id}`);

export const getClusterHosts = (id: string): AxiosPromise<Host[]> =>
  axios.get(`${API_ROOT}/clusters/${id}/hosts`);
