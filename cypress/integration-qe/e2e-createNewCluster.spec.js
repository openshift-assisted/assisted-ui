import { CLUSTER_NAME, PULL_SECRET, SSH_PUB_KEY, createCluster, generateIso } from './shared';

describe('Flow', () => {
  it('start from the /clusters page', () => {
    // Set CYPRESS_BASE_URL environemnt variable
    // Example: export CYPRESS_BASE_URL=http://localhost:3000
    cy.visit('');
  });

  it('create a cluster named ' + CLUSTER_NAME, () => {
    createCluster(CLUSTER_NAME, PULL_SECRET);
  });

  it('generate the ISO', () => {
    generateIso(SSH_PUB_KEY);
  });
});
