import axios, { AxiosPromise } from 'axios';
// import { saveAs } from 'file-saver';
import { Cluster, ClusterCreateParams, Host, ImageCreateParams } from './types';
import { API_ROOT } from '.';

export const getClusters = (): AxiosPromise<Cluster[]> => axios.get(`${API_ROOT}/clusters`);

export const getCluster = (id: string): AxiosPromise<Cluster> =>
  axios.get(`${API_ROOT}/clusters/${id}`);

export const postCluster = (params: ClusterCreateParams): AxiosPromise<Cluster> =>
  axios.post(`${API_ROOT}/clusters`, params);

// export const patchCluster = (id?: string, params?: ClusterUpdateParams): AxiosPromise<Cluster> =>
//   axios.patch(`${API_ROOT}/clusters/${id}`, params);

export const deleteCluster = (id: string): AxiosPromise<void> =>
  axios.delete(`${API_ROOT}/clusters/${id}`);

export const getClusterHosts = (id: string): AxiosPromise<Host[]> =>
  axios.get(`${API_ROOT}/clusters/${id}/hosts`);

type ImageCreateResponse = {
  imageId: string;
};
export const createClusterDownloadsImage = (
  id: string,
  params: ImageCreateParams,
): AxiosPromise<ImageCreateResponse> =>
  axios.post(`${API_ROOT}/clusters/${id}/downloads/image`, params);

export const getClusterDownloadsImageUrl = (clusterId: string, imageId: string) =>
  `/api/bm-inventory/v1/clusters/${clusterId}/downloads/image?imageId=${imageId}`;
