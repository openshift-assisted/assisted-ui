import axios, { AxiosPromise } from 'axios';
import { Host } from '../models/hosts';
import { K8sListApiResponse } from './index';

type GetHostsApiResponse = AxiosPromise<K8sListApiResponse<Host>>;

export const getHosts = (): GetHostsApiResponse => axios.get('/api/hosts');
