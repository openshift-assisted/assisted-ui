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
  /**
   * OpenShift cluster name
   */
  name?: string;
  /**
   * OpenShift cluster version
   */
  openshiftVersion?: string; // ^4\.\d$
  /**
   * The base domain of the cluster. All DNS records must be sub-domains of this base and include the cluster name.
   */
  baseDnsDomain?: string;
  /**
   * IP address block from which Pod IPs are allocated This block must not overlap with existing physical networks. These IP addresses are used for the Pod network, and if you need to access the Pods from an external network, configure load balancers and routers to manage the traffic.
   */
  clusterNetworkCIDR?: string; // ^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]|[1-2][0-9]|3[0-2]?$
  /**
   * The subnet prefix length to assign to each individual node. For example, if clusterNetworkHostPrefix is set to 23, then each node is assigned a /23 subnet out of the given cidr (clusterNetworkCIDR), which allows for 510 (2^(32 - 23) - 2) pod IPs addresses. If you are required to provide access to nodes from an external network, configure load balancers and routers to manage the traffic.
   */
  clusterNetworkHostPrefix?: number;
  /**
   * The IP address pool to use for service IP addresses. You can enter only one IP address pool. If you need to access the services from an external network, configure load balancers and routers to manage the traffic.
   */
  serviceNetworkCIDR?: string; // ^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]|[1-2][0-9]|3[0-2]?$
  /**
   * Virtual IP used to reach the OpenShift cluster API
   */
  apiVip?: string; // hostname
  /**
   * Virtual IP used internally by the cluster for automating internal DNS requirements
   */
  dnsVip?: string; // hostname
  /**
   * Virtual IP used for cluster ingress traffic
   */
  ingressVip?: string; // hostname
  /**
   * The pull secret that obtained from the Pull Secret page on the Red Hat OpenShift Cluster Manager site
   */
  pullSecret?: string;
  /**
   * SSH public key for debugging OpenShift nodes
   */
  sshPublicKey?: string;
  status: 'insufficient' | 'ready' | 'error' | 'installing' | 'installed';
  statusInfo?: string;
  hosts?: Host[];
  updatedAt?: string; // date-time
  createdAt?: string; // date-time
  installStartedAt?: string; // date-time
  installCompletedAt?: string; // date-time
}
export interface ClusterCreateParams {
  /**
   * OpenShift cluster name
   */
  name: string;
  /**
   * OpenShift cluster version
   */
  openshiftVersion: string; // ^4\.\d$
  /**
   * The base domain of the cluster. All DNS records must be sub-domains of this base and include the cluster name.
   */
  baseDnsDomain?: string;
  /**
   * IP address block from which Pod IPs are allocated This block must not overlap with existing physical networks. These IP addresses are used for the Pod network, and if you need to access the Pods from an external network, configure load balancers and routers to manage the traffic.
   */
  clusterNetworkCIDR?: string; // ^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]|[1-2][0-9]|3[0-2]?$
  /**
   * The subnet prefix length to assign to each individual node. For example, if clusterNetworkHostPrefix is set to 23, then each node is assigned a /23 subnet out of the given cidr (clusterNetworkCIDR), which allows for 510 (2^(32 - 23) - 2) pod IPs addresses. If you are required to provide access to nodes from an external network, configure load balancers and routers to manage the traffic.
   */
  clusterNetworkHostPrefix?: number;
  /**
   * The IP address pool to use for service IP addresses. You can enter only one IP address pool. If you need to access the services from an external network, configure load balancers and routers to manage the traffic.
   */
  serviceNetworkCIDR?: string; // ^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]|[1-2][0-9]|3[0-2]?$
  /**
   * Virtual IP used to reach the OpenShift cluster API
   */
  apiVip?: string; // hostname
  /**
   * Virtual IP used internally by the cluster for automating internal DNS requirements
   */
  dnsVip?: string; // hostname
  /**
   * Virtual IP used for cluster ingress traffic
   */
  ingressVip?: string; // hostname
  /**
   * The pull secret that obtained from the Pull Secret page on the Red Hat OpenShift Cluster Manager site
   */
  pullSecret?: string;
  /**
   * SSH public key for debugging OpenShift nodes
   */
  sshPublicKey?: string;
}
export type ClusterList = Cluster[];
export interface ClusterUpdateParams {
  /**
   * OpenShift cluster name
   */
  name?: string;
  /**
   * The base domain of the cluster. All DNS records must be sub-domains of this base and include the cluster name.
   */
  baseDnsDomain?: string;
  /**
   * IP address block from which Pod IPs are allocated This block must not overlap with existing physical networks. These IP addresses are used for the Pod network, and if you need to access the Pods from an external network, configure load balancers and routers to manage the traffic.
   */
  clusterNetworkCIDR?: string; // ^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]|[1-2][0-9]|3[0-2]?$
  /**
   * The subnet prefix length to assign to each individual node. For example, if clusterNetworkHostPrefix is set to 23, then each node is assigned a /23 subnet out of the given cidr (clusterNetworkCIDR), which allows for 510 (2^(32 - 23) - 2) pod IPs addresses. If you are required to provide access to nodes from an external network, configure load balancers and routers to manage the traffic.
   */
  clusterNetworkHostPrefix?: number;
  /**
   * The IP address pool to use for service IP addresses. You can enter only one IP address pool. If you need to access the services from an external network, configure load balancers and routers to manage the traffic.
   */
  serviceNetworkCIDR?: string; // ^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]|[1-2][0-9]|3[0-2]?$
  /**
   * Virtual IP used to reach the OpenShift cluster API
   */
  apiVip?: string; // hostname
  /**
   * Virtual IP used internally by the cluster for automating internal DNS requirements
   */
  dnsVip?: string; // hostname
  /**
   * Virtual IP used for cluster ingress traffic
   */
  ingressVip?: string; // hostname
  /**
   * The pull secret that obtained from the Pull Secret page on the Red Hat OpenShift Cluster Manager site
   */
  pullSecret?: string;
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
    | 'installed'
    | 'error';
  statusInfo?: string;
  connectivity?: ConnectivityReport;
  hardwareInfo?: string;
  role?: 'undefined' | 'master' | 'worker';
  updatedAt?: string; // date-time
  createdAt?: string; // date-time
}
export interface HostCreateParams {
  hostId: string; // uuid
}
export type HostInstallProgressParams = string;
export type HostList = Host[];
export interface ImageCreateParams {
  /**
   * The URL of the HTTP/S proxy that agents should use to access the discovery service
   * http://\<user\>:\<password\>@\<server\>:\<port\>/
   *
   */
  proxyURL?: string;
  /**
   * SSH public key for debugging the installation
   */
  sshPublicKey?: string;
}
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
export type StepType = 'hardware-info' | 'connectivity-check' | 'execute';
export type Steps = Step[];
export type StepsReply = StepReply[];
