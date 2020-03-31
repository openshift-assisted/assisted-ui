/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/indent: 0 */
import { Image } from './images';
import { Host } from './hosts';
import { Cluster } from '../api/types';

export enum ResourceListUIState {
  LOADING,
  ERROR,
  EMPTY,
  LOADED,
}

export type ApiResource = Host | Image | Cluster;

export enum ApiResourceKind {
  image = 'image',
  host = 'host',
  cluster = 'cluster',
}

export enum ApiResourceKindPlural {
  images = 'images',
  hosts = 'hosts',
  clusters = 'clusters',
}

export type ApiResourceBase = {
  kind: ApiResourceKind;
  id: string;
  href: string;
};

// NOTE(honza): These types are copied and pasted from openshift/console

export type MatchExpression =
  | { key: string; operator: 'Exists' | 'DoesNotExist' }
  | {
      key: string;
      operator: 'In' | 'NotIn' | 'Equals' | 'NotEquals';
      values: string[];
    };

export interface OwnerReference {
  name: string;
  kind: string;
  uid: string;
  apiVersion: string;
}

export interface ObjectMetadata {
  annotations?: { [key: string]: string };
  name: string;
  namespace?: string;
  labels?: { [key: string]: string };
  ownerReferences?: OwnerReference[];
  [key: string]: any;
}

export interface Selector {
  matchLabels?: { [key: string]: string };
  matchExpressions?: MatchExpression[];
}

export interface K8sResourceKind {
  apiVersion: string;
  kind: string;
  metadata: ObjectMetadata;
  spec?: {
    selector?: Selector;
    [key: string]: any;
  };
  status?: { [key: string]: any };
  type?: { [key: string]: any };
}
