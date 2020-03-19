import axios, { AxiosPromise } from 'axios';
import { Host } from '../types/hosts';
import { ListApiResponse } from './index';

type GetHostsApiResponse = AxiosPromise<ListApiResponse<Host>>;

export const getHosts = (): GetHostsApiResponse => axios.get('/api/hosts');
