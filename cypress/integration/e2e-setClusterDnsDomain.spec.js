import {
  CLUSTER_NAME,
  openCluster,
  saveClusterDetails,
  setClusterDnsDomain,
  DNS_DOMAIN_NAME,
} from './shared';

describe('Set DNS Domain -> ', () => {
  it('Open the cluster details', () => {
    openCluster(CLUSTER_NAME);
  });

  it('Set DNS Domain', () => {
    setClusterDnsDomain(DNS_DOMAIN_NAME);
  });

  it('Save changes', () => {
    saveClusterDetails(cy);
  });
});
