import axios, { AxiosPromise } from 'axios';
import { ApiResourceKindPlural } from '../types';

export const API_ROOT = '/api/bm-inventory/v1';

export const getResourceList = <T>(resourceKindPlural: ApiResourceKindPlural): AxiosPromise<T[]> =>
  axios.get(`${API_ROOT}/${resourceKindPlural}`, {
    headers: {
      accept: 'application/json',
    },
  });
