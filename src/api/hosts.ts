import axios, { AxiosPromise } from 'axios';
import { Host } from '../types/hosts';

export const getHosts = (): AxiosPromise<Host[]> => axios.get('/api/bm-inventory/v1/nodes');
