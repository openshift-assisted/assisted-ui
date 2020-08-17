import { CLUSTER_NAME } from './shared';
import {
  OCM_USER,
  OCM_USER_PASSWORD,
  loginOCM,
  createClusterHosted,
  verifyClusterCreationHosted,
} from './ocmShared';

describe('member user can create cluster in hosted env', () => {
  it('log in to OCM', () => {
    // Set CYPRESS_OCM_USER and CYPRESS_OCM_USER_PASSWORD env variables
    loginOCM(OCM_USER, OCM_USER_PASSWORD);
  });

  it('Can navigate to assisted-installer and create cluster', () => {
    createClusterHosted(CLUSTER_NAME);
    verifyClusterCreationHosted(CLUSTER_NAME);
  });
});
