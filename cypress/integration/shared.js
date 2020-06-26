export const testInfraClusterName = 'test-infra-cluster';
export const testInfraClusterHostnames = [
  'test-infra-cluster-master-0',
  'test-infra-cluster-master-1',
  'test-infra-cluster-master-2',
];

export const withValueOf = (cy, selector, handler) => {
  cy.get(selector).then((elem) => handler(elem[0].innerText));
};

export const testClusterLinkSelector = `#cluster-link-${testInfraClusterName}`;
const clusterNameLinkSelector = '[data-label="Name"] > a'; // on '/clusters' page
// const singleClusterCellSelector = (column) => `tbody > tr > [data-label="${column}"]`;
export const clusterTableCellSelector = (row, column) =>
  `tbody > tr:nth-child(${row}) > [data-label="${column}"]`;

export const createDummyCluster = (cy, clusterName) => {
  cy.get('#button-create-new-cluster').click();
  cy.get('.pf-c-modal-box'); // modal visible
  cy.get('#pf-modal-part-1').contains('New Bare Metal OpenShift Cluster');
  cy.get('.pf-m-secondary').click(); // cancel

  cy.get('.pf-c-modal-box').should('not.be.visible'); // modal closed
  cy.get('#button-create-new-cluster').click();
  cy.get('.pf-c-modal-box'); // modal visible again

  // do not allow two clusters of the same name
  cy.get('#form-input-name-field').type(`{selectall}{backspace}${testInfraClusterName}`);
  cy.get('.pf-c-modal-box__footer > .pf-m-primary').click();
  cy.get('#form-input-name-field-helper').contains('is already taken');

  // type correct dummy cluster name
  cy.get('#form-input-name-field').type(`{selectall}{backspace}${clusterName}`);
  cy.get('.pf-c-modal-box__footer > .pf-m-primary').click();

  // Cluster configuration
  cy.get('.pf-c-breadcrumb__list > :nth-child(2)').contains(clusterName);
  cy.get('#form-input-name-field').should('have.value', clusterName);

  // Close
  cy.get(':nth-child(4) > .pf-c-button').click();
};

export const deleteDummyCluster = (cy, tableRow, clusterName) => {
  const kebabSelector = `tbody > tr:nth-child(${tableRow}) > td.pf-c-table__action > div`;
  cy.get(kebabSelector).click(); // open kebab menu
  cy.get(`#button-delete-${clusterName}`).click(); // Delete & validate correct kebab from previous step
  cy.get('[data-test-id="delete-cluster-submit"]').click();
  cy.get(clusterNameLinkSelector).should('have.length', 1);
  cy.get(clusterNameLinkSelector).contains(testInfraClusterName); // validate that just one cluster remains
};

export const assertTestClusterPresence = (cy) => {
  cy.visit('/clusters');
  cy.get(testClusterLinkSelector).contains(testInfraClusterName);
  cy.get(clusterTableCellSelector(1, 'Base domain')).contains('redhat.com');
  cy.get(clusterTableCellSelector(1, 'Version')).contains('4.5'); // fail to raise attention when source data changes
  cy.get(clusterTableCellSelector(1, 'Status')).contains('Ready');
  cy.get(clusterTableCellSelector(1, 'Hosts')).contains(3);
};

export const visitTestCluster = (cy) => {
  assertTestClusterPresence(cy);
  cy.visit('/clusters');
  cy.get(testClusterLinkSelector).click();
};

export const checkValidationMessage = (cy, expectedMsg) => {
  cy.get(':nth-child(5) > [data-pf-content="true"] > .pf-c-button').contains(
    'The cluster is not ready to be installed yet',
  );

  cy.get('.pf-c-alert').should('not.be.visible');
  cy.get(':nth-child(5) > [data-pf-content="true"] > .pf-c-button').click();
  cy.get('.pf-c-alert').should('be.visible');
  cy.get('.pf-c-alert__description').contains(expectedMsg);

  // Close
  cy.get('.pf-l-split > :nth-child(2) > .pf-c-button').click(); // close alerts
  cy.get('.pf-c-alert').should('not.be.visible');
};
