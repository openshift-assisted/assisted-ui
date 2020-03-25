export interface ClusterDefinition {
  clusterName: string;
  DNSDomain: string;
  openshiftVersion: string;
  apiVIP: string;
  dnsVIP: string;
  ingressVIP: string;
  machineCIDR: string;
  pullSecret: string;
  sshPrivateKey: string;
  sshPublicKey: string;
}
