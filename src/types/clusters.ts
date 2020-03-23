export type Cluster = {
  kind: string;
  id: string;
  href: string;
  name: string;
  description?: string;
  hosts: HostRef[];
  namespace: string;
  status: string;
};

export type HostRef = {
  id: string;
  role: string;
};

export enum HostRole {
  master,
  worker,
}

export enum ClusterStatus {
  creating,
  ready,
  error,
}
