import axios, { AxiosPromise } from 'axios';
import { Cluster, ClusterCreateParams } from './types';

export const createCluster = (params: ClusterCreateParams): AxiosPromise<Cluster> =>
  axios.post('/api/bm-inventory/v1/clusters', params);

export const getCluster = (id: string): AxiosPromise<Cluster> =>
  axios.get(`/api/bm-inventory/v1/clusters/${id}`);

export const deleteCluster = (id: string): AxiosPromise<void> =>
  axios.delete(`/api/bm-inventory/v1/clusters/${id}`);
