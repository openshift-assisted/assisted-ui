export interface Base {
  kind: 'image' | 'host' | 'cluster';
  id: string; // uuid
  href: string; // uri
}
export interface BlockDevice {
  name?: string;
  'major-device-number'?: number;
  'minor-device-number'?: number;
  'removable-device'?: number;
  size?: number;
  'read-only'?: boolean;
  'device-type'?: string;
  mountpoint?: string;
  fstype?: string;
}
export interface Cidr {
  'ip-address'?: string;
  mask?: number;
}
export interface Cluster {
  kind: 'image' | 'host' | 'cluster';
  id: string; // uuid
  href: string; // uri
  name?: string;
  openshiftVersion?: string; // ^4\.\d$
  baseDnsDomain?: string;
  apiVip?: string; // hostname
  dnsVip?: string; // hostname
  ingressVip?: string; // hostname
  /**
   * SSH public key for debugging OpenShift nodes
   */
  sshPublicKey?: string;
  status: 'creating' | 'ready' | 'error';
  hosts?: Host[];
  updatedAt?: string; // date-time
  installStartedAt?: string; // date-time
  installCompletedAt?: string; // date-time
}
export interface ClusterCreateParams {
  name: string;
  openshiftVersion?: string; // ^4\.\d$
  baseDnsDomain?: string;
  apiVip?: string; // hostname
  dnsVip?: string; // hostname
  ingressVip?: string; // hostname
  /**
   * SSH public key for debugging OpenShift nodes
   */
  sshPublicKey?: string;
}
export type ClusterList = Cluster[];
export interface ClusterUpdateParams {
  name?: string;
  openshiftVersion?: string; // ^4\.\d$
  baseDnsDomain?: string;
  apiVip?: string; // hostname
  dnsVip?: string; // hostname
  ingressVip?: string; // hostname
  /**
   * SSH public key for debugging OpenShift nodes
   */
  sshPublicKey?: string;
  hostsRoles?: {
    id?: string; // uuid
    role?: 'master' | 'worker';
  }[];
}
export interface ConnectivityCheckHost {
  'host-id'?: string; // uuid
  nics?: ConnectivityCheckNic[];
}
export interface ConnectivityCheckNic {
  name?: string;
  mac?: string;
  'ip-addresses'?: string[];
}
export type ConnectivityCheckParams = ConnectivityCheckHost[];
export interface ConnectivityRemoteHost {
  'host-id'?: string; // uuid
  'l2-connectivity'?: L2Connectivity[];
  'l3-connectivity'?: L3Connectivity[];
}
export interface ConnectivityReport {
  'remote-hosts'?: ConnectivityRemoteHost[];
}
export interface Cpu {
  architecture?: string;
  'model-name'?: string;
  cpus?: number;
  'threads-per-core'?: number;
  sockets?: number;
  'cpu-mhz'?: number;
}
export interface DebugStep {
  command: string;
}
export interface Host {
  kind: 'image' | 'host' | 'cluster';
  id: string; // uuid
  href: string; // uri
  hostId: string; // uuid
  clusterId?: string; // uuid
  status:
    | 'discovering'
    | 'known'
    | 'disconnected'
    | 'insufficient'
    | 'disabled'
    | 'installing'
    | 'installed';
  statusInfo: string;
  connectivity: ConnectivityReport;
  hardware_info?: Introspection;
  role?: 'undefined' | 'master' | 'worker';
  updatedAt?: string; // date-time
}
export interface HostCreateParams {
  hostId: string; // uuid
}
export type HostList = Host[];
export interface Introspection {
  cpu?: Cpu;
  'block-devices'?: BlockDevice[];
  memory?: Memory[];
  nics?: Nic[];
}
export interface L2Connectivity {
  'outgoing-nic'?: string;
  'outgoing-ip-address'?: string;
  'remote-ip-address'?: string;
  'remote-mac'?: string;
  successful?: boolean;
}
export interface L3Connectivity {
  'outgoing-nic'?: string;
  'remote-ip-address'?: string;
  successful?: boolean;
}
export interface Memory {
  name?: string;
  total?: number;
  used?: number;
  free?: number;
  shared?: number;
  'buff-cached'?: number;
  available?: number;
}
export interface Nic {
  name?: string;
  state?: string;
  mtu?: number;
  mac?: string;
  cidrs?: Cidr[];
}
export interface Step {
  'step-type'?: StepType;
  'step-id'?: string;
  command?: string;
  args?: string[];
}
export interface StepReply {
  'step-id'?: string;
  'exit-code'?: number;
  output?: string;
  error?: string;
}
export type StepType = 'hardaware-info' | 'connectivity-check' | 'execute';
export type Steps = Step[];
export type StepsReply = StepReply[];
