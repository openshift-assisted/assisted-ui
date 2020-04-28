import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
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

export const enableClusterHost = (clusterId: string, hostId: string): AxiosPromise<void> =>
  axios.post(`${API_ROOT}/clusters/${clusterId}/hosts/${hostId}/actions/enableX`);

export const disableClusterHost = (clusterId: string, hostId: string): AxiosPromise<void> =>
  axios.delete(`${API_ROOT}/clusters/${clusterId}/hosts/${hostId}/actions/enableX`);

type ImageCreateResponse = {
  imageId: string;
};
export const createClusterDownloadsImage = (
  id: string,
  params: ImageCreateParams,
  axiosOptions: AxiosRequestConfig,
): AxiosPromise<ImageCreateResponse> =>
  axios.post<ImageCreateResponse>(
    `${API_ROOT}/clusters/${id}/downloads/image`,
    params,
    axiosOptions,
  );

export const getClusterDownloadsImageUrl = (clusterId: string, imageId: string) =>
  `/api/bm-inventory/v1/clusters/${clusterId}/downloads/image?imageId=${imageId}`;
