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
  openshift_version?: string; // ^4\.\d$
  base_dns_domain?: string;
  api_vip?: string; // hostname
  dns_vip?: string; // hostname
  ingress_vip?: string; // hostname
  /**
   * SSH public key for debugging OpenShift nodes
   */
  ssh_public_key?: string;
  status: 'creating' | 'ready' | 'error';
  hosts?: Host[];
  updated_at?: string; // date-time
  install_started_at?: string; // date-time
  install_completed_at?: string; // date-time
}
export interface ClusterCreateParams {
  name: string;
  openshift_version?: string; // ^4\.\d$
  base_dns_domain?: string;
  api_vip?: string; // hostname
  dns_vip?: string; // hostname
  ingress_vip?: string; // hostname
  /**
   * SSH public key for debugging OpenShift nodes
   */
  ssh_public_key?: string;
}
export type ClusterList = Cluster[];
export interface ClusterUpdateParams {
  name?: string;
  openshift_version?: string; // ^4\.\d$
  base_dns_domain?: string;
  api_vip?: string; // hostname
  dns_vip?: string; // hostname
  ingress_vip?: string; // hostname
  /**
   * SSH public key for debugging OpenShift nodes
   */
  ssh_public_key?: string;
  hosts_roles?: {
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
  host_id: string; // uuid
  cluster_id?: string; // uuid
  status:
    | 'discovering'
    | 'known'
    | 'disconnected'
    | 'insufficient'
    | 'disabled'
    | 'installing'
    | 'installed';
  status_info: string;
  connectivity: ConnectivityReport;
  hardware_info: Introspection;
  role?: 'undefined' | 'master' | 'worker';
  updated_at?: string; // date-time
}
export interface HostCreateParams {
  host_id: string; // uuid
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
