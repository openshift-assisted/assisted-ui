import axios, { AxiosPromise } from 'axios';
import { IntrospectionData } from '../models/introspectionData';
import { ApiResponse } from './index';

type GetIntrospectionDataApiResponse = AxiosPromise<
  ApiResponse<IntrospectionData>
>;

export const getIntrospectionData = (
  host: string
): GetIntrospectionDataApiResponse =>
  axios.get(`/api/introspection_data/${host}`);
