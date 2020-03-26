import { ApiResource } from '../types';

export interface ResourceState<T extends ApiResource> {
  items: T[];
  error: string;
  loading: boolean;
}
