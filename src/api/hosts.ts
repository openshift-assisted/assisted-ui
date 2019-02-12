import axios, { AxiosPromise } from 'axios';
import { Host } from '../models/hosts';
import { ApiResponse } from './index';

type GetHostsApiResponse = AxiosPromise<ApiResponse<Host[]>>;

export const getHosts = (): GetHostsApiResponse => axios.get('/api/hosts');
