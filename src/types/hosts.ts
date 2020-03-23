// import { K8sResourceKind } from './index';

import { ApiResourceBase } from '.';

// export type Host = K8sResourceKind;

export type HostTableRow = string[];
export type HostTableRows = HostTableRow[];

export enum HostStatus {
  discovering = 'discovering',
  known = 'known',
  disconnected = 'disconnected',
  insufficient = 'insufficient',
  disabled = 'disabled',
  installing = 'installing',
  installed = 'installed',
}

export type L2Connectivity = {
  outgoingNic: string;
  outgoingIpAddress: string;
  remoteIpAddress: string;
  remoteMac: string;
  successful: boolean;
};

export type L3Connectivity = {
  outgoingNic: string;
  remoteIpAddress: string;
  successful: boolean;
};

export type ConnectivityRemoteHost = {
  host_id: string;
  l2_connectivity: L2Connectivity[];
  l3_connectivity: L3Connectivity[];
};

export type ConnectivityReport = {
  remote_hosts: ConnectivityRemoteHost[];
};

export type CPU = {
  architecture: string;
  modelName: string;
  cpus: string;
  threads_per_core: string;
  sockets: string;
  cpuMHZ: number;
};

export type Introspection = {
  cpu: CPU;
  block_devices: any;
  memory: any;
  nics: any;
};

export type Host = ApiResourceBase & {
  namespace: string;
  host_id: string;
  status: HostStatus;
  status_info?: string;
  cluster_id?: string;
  connectivity?: ConnectivityReport;
  hardware_info?: Introspection;
};
