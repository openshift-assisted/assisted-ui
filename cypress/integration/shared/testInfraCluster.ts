import { assertClusterPresence, getClusterNameLinkSelector } from './clusterListPage';
import { DEFAULT_API_REQUEST_TIMEOUT } from './constants';

export const TEST_INFRA_CLUSTER_NAME = 'test-infra-cluster-assisted-installer';
export const TEST_INFRA_HOSTNAMES = [
  'test-infra-cluster-assisted-installer-master-0',
  'test-infra-cluster-assisted-installer-master-1',
  'test-infra-cluster-assisted-installer-master-2',
];

export const visitTestInfraCluster = (cy: Cypress.cy) => {
  assertClusterPresence(cy, TEST_INFRA_CLUSTER_NAME);
  cy.visit('/clusters');
  cy.get(getClusterNameLinkSelector(TEST_INFRA_CLUSTER_NAME), {
    timeout: DEFAULT_API_REQUEST_TIMEOUT,
  }).click();
};
