import { createSelector } from 'reselect';

import { Image, ImageTableRows } from '../types/images';
import { ApiResourceKindPlural } from '../types';
import {
  createGetResourcesError,
  createGetResources,
  createGetResourcesUIState,
} from './resources';

export const getImagesError = createGetResourcesError(ApiResourceKindPlural.clusters);

const clusterToImageTableRow = (image: Image): string[] => {
  // const { spec = {}, status = {} } = host;
  // return [
  //   host.metadata.name,
  //   spec.bmc.ip,
  //   spec.online ? 'Online' : 'Offline',
  //   status.hardware.cpus.length.toString(),
  //   status.hardware.ramGiB.toString(),
  //   status.hardware.storage[0].sizeGiB.toString(),
  //   'Master',
  // ];
  const { name, namespace, proxy_ip, proxy_port, status, download_url } = image;
  return [name, namespace, `${proxy_ip}:${proxy_port}`, status, `${download_url}`];
};

export const getImageTableRows = createSelector(
  createGetResources<Image>(ApiResourceKindPlural.images),
  (images): ImageTableRows => images.map(clusterToImageTableRow),
);

export const getImagesUIState = createGetResourcesUIState(ApiResourceKindPlural.images);
