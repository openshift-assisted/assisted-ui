/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/indent: 0 */
import { Cluster, Host } from '../api/types';

export enum ResourceUIState {
  LOADING,
  ERROR,
  EMPTY,
  LOADED,
}

export type ApiResource = Host | Cluster;

export enum ApiResourceKind {
  host = 'host',
  cluster = 'cluster',
}

export enum ApiResourceKindPlural {
  hosts = 'hosts',
  clusters = 'clusters',
}

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
