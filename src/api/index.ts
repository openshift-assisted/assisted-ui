import axios, { AxiosPromise } from 'axios';
import { ApiResourceKindPlural } from '../types';

export const getResourceList = <T>(resourceKindPlural: ApiResourceKindPlural): AxiosPromise<T[]> =>
  axios.get(`/api/bm-inventory/v1/${resourceKindPlural}`);
