import axios, { AxiosPromise } from 'axios';
import { Host } from '../models/hosts';
import { ApiResponse } from './index';

type HostListApiReponse = AxiosPromise<ApiResponse<Host[]>>;

// TODO: Add configuration for the API endpoint
export const getHosts = (): HostListApiReponse => axios.get('/api/hosts');
