import {
  CLUSTER_NAME,
  openCluster,
  disableDhcpVip,
  API_VIP,
  INGRESS_VIP,
  saveClusterDetails,
} from './shared';

describe('Disable Dhcp Vip', () => {
  it('open the cluster details', () => {
    openCluster(CLUSTER_NAME);
  });

  it('disable dhcp', () => {
    disableDhcpVip(cy, API_VIP, INGRESS_VIP);
  });

  it('save changes', () => {
    saveClusterDetails(cy);
  });
});
