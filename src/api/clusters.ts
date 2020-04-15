import axios, { AxiosPromise } from 'axios';
import { saveAs } from 'file-saver';
import { Cluster, ClusterCreateParams, Host, ClusterUpdateParams } from './types';
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

export type GetClusterDownloadsImageParams = {
  proxyIp?: string;
  proxyPort?: string;
  sshPublicKey?: string;
};
export type GetClusterDownloadsImageArgs = [string, GetClusterDownloadsImageParams];

export const getClusterDownloadsImage = ([id, params]: GetClusterDownloadsImageArgs): AxiosPromise<
  string
> =>
  axios.get(`${API_ROOT}/clusters/${id}/downloads/image`, {
    params,
    responseType: 'blob',
    onDownloadProgress: function (progressEvent) {
      console.log('onDownloadProgress', progressEvent);
    },
    headers: {
      accept: 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="discovery.iso"; filename*="discovery.iso"',
    },
  });
