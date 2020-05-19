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
  // TODO(mlibra): bug - confirmation modal should appear now (not implemented so far)
  cy.get('[data-label="Name"] > a').should('have.length', 1);
  cy.get('[data-label="Name"] > a').contains('ostest'); // validate that just one cluster remains
};

export const assertSingleClusterOnly = (cy) => {
  cy.visit('/clusters');
  cy.get('[data-label="Name"] > a').should('have.length', 1);
  cy.get('[data-label="Name"] > a').contains('ostest');
};
