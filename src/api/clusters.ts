import axios, { AxiosPromise } from 'axios';
import { Cluster } from '../types/clusters';

export const getClusters = (): AxiosPromise<Cluster[]> =>
  axios.get('/api/bm-inventory/v1/clusters');
