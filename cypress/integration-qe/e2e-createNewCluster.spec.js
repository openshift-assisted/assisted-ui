import {
  CLUSTER_NAME,
  PULL_SECRET,
  SSH_PUB_KEY,
  createCluster,
  generateIso,
  downloadFileWithChrome,
} from './shared';

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

  it('download the ISO', () => {
    cy.get('#button-download-discovery-iso').click(); // open the dialog
    cy.get('.pf-c-modal-box__footer > .pf-m-primary').click(); // "Get Discovery ISO"
    downloadFileWithChrome('button[data-test-id="download-iso-btn"]', ' ~/Downloads/cluster-*.iso');
    cy.get('button[data-test-id="close-iso-btn"]').click(); // now close the dialog
    cy.exec('mv -f ~/Downloads/cluster-*.iso /var/lib/libvirt/images/cluster-discovery.iso');
  });
});
