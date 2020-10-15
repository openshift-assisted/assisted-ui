import { openCluster, CLUSTER_NAME, saveClusterDetails, enableRoute53 } from './shared';

describe('Enable route53 : ', () => {
  it('open cluster details', () => {
    openCluster(CLUSTER_NAME);
  });

  it('enable route53 option', () => {
    enableRoute53(cy);
  });

  it('save changes', () => {
    saveClusterDetails(cy);
  });
});
