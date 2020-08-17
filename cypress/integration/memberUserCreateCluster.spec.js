import {
  createClusterHosted,
  loginOCM,
  verifyClusterCreation,
  CLUSTER_NAME,
  OCM_USER,
  OCM_USER_PASSWORD,
} from './shared';

describe('Member User Can Created Cluster in hosted env', () => {
  it('log in to OCM', () => {
    // Set CYPRESS_OCM_USER and CYPRESS_OCM_USER_PASSWORD env variables
    loginOCM(OCM_USER, OCM_USER_PASSWORD);
  });

  it('Can navigate to assisted-installer and create cluster', () => {
    createClusterHosted(CLUSTER_NAME);
    verifyClusterCreation(CLUSTER_NAME);
  });
});
