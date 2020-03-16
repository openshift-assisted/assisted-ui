import axios, { AxiosPromise } from 'axios';
import { mapKeys, snakeCase } from 'lodash';

import { ClusterDefinition } from '../models/clusterDefinition';
import { ApiResponse } from './index';

type PostClusterDefinitionApiRequestKeys =
  | 'cluster_name'
  | 'dns_domain'
  | 'username'
  | 'password'
  | 'pull_secret';

type PostClusterDefinitionApiRequestData = {
  [T in PostClusterDefinitionApiRequestKeys]: string;
};

type PostClusterDefinitionApiResponse = AxiosPromise<ApiResponse<ClusterDefinition>>;

const snakeCaseKeys = (values: ClusterDefinition): PostClusterDefinitionApiRequestData =>
  mapKeys(values, (value, key) => snakeCase(key)) as PostClusterDefinitionApiRequestData;

export const postInstallConfig = (values: ClusterDefinition): PostClusterDefinitionApiResponse =>
  axios.post('/api/cluster-definition', snakeCaseKeys(values));
