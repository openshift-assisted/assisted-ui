import {
  CLUSTER_NAME,
  NETWORK_CIDR,
  NETWORK_HOST_PREFIX,
  SERVICE_NETWORK_CIDR,
  openCluster,
  enableAdvancedNetworking,
  saveClusterDetails,
} from './shared';

describe('Enable Advanced Networking', () => {
  it('open the cluster details', () => {
    openCluster(CLUSTER_NAME);
  });

  it('enable advanced networking', () => {
    enableAdvancedNetworking(cy, NETWORK_CIDR, NETWORK_HOST_PREFIX, SERVICE_NETWORK_CIDR);
  });

  it('save changes', () => {
    saveClusterDetails(cy);
  });
});
