export interface ResourceState<T> {
  items: T[];
  error: string;
  loading: boolean;
}
