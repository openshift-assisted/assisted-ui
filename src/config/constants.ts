import { ClusterCreateParams, Cluster, Host } from '../api/types';

type OpenshiftVersionOptionType = {
  label: string;
  value: ClusterCreateParams['openshiftVersion'];
};

export const OPENSHIFT_VERSION_OPTIONS: OpenshiftVersionOptionType[] = [
  // { label: 'OpenShift 4.4', value: '4.4' },
  { label: 'OpenShift 4.5', value: '4.5' },
  // { label: 'OpenShift 4.6', value: '4.6' },
];

export const CLUSTER_MANAGER_SITE_LINK =
  'https://cloud.redhat.com/openshift/install/metal/user-provisioned';

export const POLLING_INTERVAL = 10000;

export const HOST_ROLES = ['worker', 'master'];
// Without undefined. Otherwise must conform generated Host['roles'] - see api/types.ts
export type HostRolesType = 'master' | 'worker';

export const CLUSTER_STATUS_LABELS: { [key in Cluster['status']]: string } = {
  insufficient: 'Draft',
  ready: 'Ready',
  installing: 'Installing',
  error: 'Error',
  installed: 'Installed',
};

export const HOST_STATUS_LABELS: { [key in Host['status']]: string } = {
  discovering: 'Discovering',
  known: 'Known',
  disconnected: 'Disconnected',
  insufficient: 'Insufficient',
  disabled: 'Disabled',
  installing: 'Starting Installation',
  'installing-in-progress': 'Installing',
  installed: 'Installed',
  error: 'Error',
};

export const HOST_STATUS_DETAILS: { [key in Host['status']]: string } = {
  discovering:
    'This host is transmitting its hardware and networking information to the installer. Please wait while this information is received.',
  known:
    'This host meets the minimum hardware and networking requirements and will be included in the cluster.',
  disconnected:
    'This host has lost its connection to the installer and will not be included in the cluster unless connectivity is restored.',
  insufficient:
    'This host does not meet the minimum hardware or networking requirements and will not be included in the cluster.',
  disabled:
    'This host was manually disabled and will not be included in the cluster. Enable this host to include it again.',
  installing: '', // not rendered
  'installing-in-progress': '', // not rendered
  installed: 'This host completed its installation successfully',
  error: 'This host failed its installation.',
};
