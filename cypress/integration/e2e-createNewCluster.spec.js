import {
  CLUSTER_NAME,
  PULL_SECRET,
  SSH_PUB_KEY,
  createCluster,
  generateIso,
  downloadFileWithChrome,
  ISO_PATTERN,
  OCM_USER,
} from './shared';

import { ISO_DOWNLOAD_TIMEOUT } from './constants';

import { writeCookieToDisk } from './ocmShared';

describe('Flow', () => {
  it('start from the /clusters page', () => {
    // Set CYPRESS_BASE_URL environemnt variable
    // Example: export CYPRESS_BASE_URL=http://localhost:3000
    cy.visit('');
  });

  it('create a cluster named ' + CLUSTER_NAME, () => {
    createCluster(cy, CLUSTER_NAME, PULL_SECRET);
  });

  it('generate the ISO', () => {
    generateIso(SSH_PUB_KEY);
  });

  it('download the ISO', () => {
    cy.get('#bare-metal-inventory-button-download-discovery-iso').click(); // open the dialog
    cy.wait(10 * 1000); // wait few seconds otherwise HTTP 409 will be raised
    cy.get('.pf-c-modal-box__footer > .pf-m-primary').click(); // "Get Discovery ISO"
    downloadFileWithChrome(
      'button[data-test-id="download-iso-btn"]',
      ISO_PATTERN,
      ISO_DOWNLOAD_TIMEOUT,
    );
    cy.get('button[data-test-id="close-iso-btn"]').click(); // now close the dialog
  });

  it('refresh cookie', () => {
    if (OCM_USER) {
      writeCookieToDisk();
    }
  });
});
