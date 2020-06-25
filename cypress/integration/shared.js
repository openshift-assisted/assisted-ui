export const testInfraClusterName = 'test-infra-cluster';
export const testInfraClusterHostsCount = 3;

export const withValueOf = (cy, selector, handler) => {
  cy.get(selector).then((elem) => handler(elem[0].innerText));
};

const clusterNameLinkSelector = '[data-label="Name"] > a'; // on '/clusters' page
const testClusterLinkSelector = `#cluster-link-${testInfraClusterName}`;
const testClusterStatusSelector = `#button-cluster-status-${testInfraClusterName}`;

export const createDummyCluster = (cy, clusterName) => {
  cy.get('.pf-l-toolbar__item > .pf-c-button').click();
  cy.get('.pf-c-modal-box'); // modal visible
  cy.get('.pf-c-title').contains('New Bare Metal OpenShift Cluster');
  cy.get('.pf-m-secondary').click(); // cancel

  cy.get('.pf-c-modal-box').should('not.be.visible'); // modal closed
  cy.get('.pf-l-toolbar__item > .pf-c-button').click();
  cy.get('.pf-c-modal-box'); // modal visible

  cy.get('#form-input-name-field').type(`{selectall}{backspace}${clusterName}`);
  cy.get('.pf-c-modal-box__footer > .pf-m-primary').click();

  // Cluster configuration
  cy.get('.pf-c-breadcrumb__list > :nth-child(2)').contains(clusterName);
  cy.get('#form-input-name-field').should('have.value', clusterName);
  cy.get(':nth-child(3) > .pf-l-toolbar__item > .pf-c-button').click(); // Close button
};

export const deleteDummyCluster = (cy, kebabSelector) => {
  cy.get(kebabSelector).click(); // open kebab menu
  cy.get('.pf-c-dropdown__menu-item').click(); // Delete
  cy.get('[data-test-id="delete-cluster-submit"]').click();
  cy.get(clusterNameLinkSelector).should('have.length', 1);
  cy.get(clusterNameLinkSelector).contains(testInfraClusterName); // validate that just one cluster remains
};

export const assertSingleClusterOnly = (cy) => {
  cy.visit('/clusters');
  cy.get(clusterNameLinkSelector).should('have.length', 1);
  cy.get(clusterNameLinkSelector).contains(testInfraClusterName);
  withValueOf(cy, 'tbody > tr > [data-label="Status"]', (val) => {
    expect(['Ready']).to.include(val.trim());
  });
  cy.get('tbody > tr > [data-label="Version"]').contains('4.4'); // fail to raise attention when source data changes
};

export const assertTestClusterPresence = (cy) => {
  cy.visit('/clusters');
  cy.get(testClusterLinkSelector).contains(testInfraClusterName);
  cy.get(testClusterStatusSelector).contains('Ready');
  cy.get('tbody > tr > [data-label="Version"]').contains('4.5'); // fail to raise attention when source data changes
};

export const visitOneAndOnlyCluster = (cy) => {
  assertSingleClusterOnly(cy);
  cy.visit('/clusters');
  cy.get(clusterNameLinkSelector).click();
};
