import { CLUSTER_NAME, openCluster, enableDhcpVip, saveClusterDetails } from './shared';

describe('Enable Dhcp Vip', () => {
  it('open the cluster details', () => {
    openCluster(CLUSTER_NAME);
  });

  it('enable dhcp', () => {
    enableDhcpVip(cy);
  });

  it('save changes', () => {
    saveClusterDetails(cy);
  });
});
