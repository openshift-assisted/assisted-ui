import { kebabSelectorByRowId, pasteText } from './common';
import {
  DEFAULT_API_REQUEST_TIMEOUT,
  DEFAULT_SAVE_BUTTON_TIMEOUT,
  DEFAULT_CREATE_CLUSTER_BUTTON_SHOW_TIMEOUT,
  HOSTS_DISCOVERY_TIMEOUT,
} from './constants';
import { TEST_INFRA_CLUSTER_NAME } from './testInfraCluster';
import { OCM_USER, OPENSHIFT_VERSION } from './variables';

// Selectors
export const getClusterNameLinkSelector = (clusterName: string) => `#cluster-link-${clusterName}`;

export const clusterTableCellSelector = (clusterName: string, columnName: string) =>
  `#cluster-row-${clusterName} > [data-label="${columnName}"]`;

export const clusterTableCellSelectorByRowIndex = (index: number, columnName: string) =>
  `table > tbody > tr:nth-child(${index}) > td[data-label="${columnName}"]`;

// Asserts
export const assertClusterPresence = (cy: Cypress.cy, clusterName: string) => {
  cy.visit('/clusters');
  cy.get(getClusterNameLinkSelector(clusterName)).contains(clusterName);
  cy.get(clusterTableCellSelector(clusterName, 'Base domain')).contains('redhat.com');
  cy.get(clusterTableCellSelector(clusterName, 'Version')).contains('4.6'); // fail to raise attention when source data changes
  cy.get(clusterTableCellSelector(clusterName, 'Status')).contains('Ready', {
    timeout: HOSTS_DISCOVERY_TIMEOUT,
  });
  cy.get(clusterTableCellSelector(clusterName, 'Hosts')).contains(3);
};

export const openCluster = (cy: Cypress.cy, clusterName: string) => {
  cy.visit('');
  cy.get(getClusterNameLinkSelector(clusterName)).contains(clusterName);
  cy.get(getClusterNameLinkSelector(clusterName)).click();
  cy.get('h1').contains('Install OpenShift on Bare Metal with the Assisted Installer'); // Make sure the page is loaded
};

export const createClusterFillForm = (cy: Cypress.cy, clusterName: string, pullSecret: string) => {
  cy.visit('');

  cy.get('button[data-ouia-id="button-create-new-cluster"]', {
    timeout: DEFAULT_CREATE_CLUSTER_BUTTON_SHOW_TIMEOUT,
  }).click();
  cy.get('.pf-c-breadcrumb__list > :nth-child(3)').contains('New cluster');
  cy.get('#form-input-name-field').should('be.visible');
  cy.get('h1').contains('Install OpenShift on Bare Metal with the Assisted Installer');

  // type correct dummy cluster name
  cy.get('#form-input-name-field').type(`{selectall}{backspace}${clusterName}`);
  cy.get('#form-input-name-field').should('have.value', clusterName);
  cy.get('#form-input-openshiftVersion-field').select(OPENSHIFT_VERSION);
  if (!OCM_USER) {
    cy.get('#form-input-pullSecret-field').clear();
    pasteText(cy, '#form-input-pullSecret-field', pullSecret);
  }
};

export const cancelCreateCluster = (cy: Cypress.cy) => {
  // double-check we are on the create-cluster page
  cy.get('h1').contains('Install OpenShift on Bare Metal with the Assisted Installer');

  // cancel
  cy.get('#new-cluster-page-cancel').click(); // cancel
  cy.get('#form-input-name-field').should('not.exist');
  cy.get('#form-input-openshiftVersion-field').should('not.exist');
  cy.get('#form-input-pullSecret-field').should('not.exist');

  // we should be navigated back to cluster-list page
  cy.get('h1').contains('Assisted Bare Metal Clusters');
};

export const createCluster = (cy: Cypress.cy, clusterName: string, pullSecret: string) => {
  createClusterFillForm(cy, clusterName, pullSecret);

  cy.get('button[name="save"]').click();
  cy.get('#bare-metal-inventory-button-download-discovery-iso', {
    timeout: DEFAULT_SAVE_BUTTON_TIMEOUT,
  });

  // Assert in Cluster configuration
  cy.get('.pf-c-breadcrumb__list > :nth-child(3)', {
    timeout: DEFAULT_API_REQUEST_TIMEOUT,
  }).contains(clusterName);
  cy.get('#bare-metal-inventory-button-download-discovery-iso', { timeout: 10 * 1000 }).should(
    'be.visible',
  );
  cy.get('#form-input-name-field').should('have.value', clusterName);
};

export const deleteClusterByName = (cy: Cypress.cy, clusterName: string) => {
  cy.visit('');
  cy.get(kebabSelectorByRowId(`cluster-row-${clusterName}`)).click(); // open kebab menu
  cy.get(`#button-delete-${clusterName}`).click(); // Delete & validate correct kebab from previous step
  cy.get('[data-test-id="delete-cluster-submit"]').click();

  cy.get(getClusterNameLinkSelector(clusterName)).should('not.exist');
  if (clusterName !== TEST_INFRA_CLUSTER_NAME) {
    cy.get(getClusterNameLinkSelector(TEST_INFRA_CLUSTER_NAME)); // validate that the test-infra-cluster is still present
  }
};
