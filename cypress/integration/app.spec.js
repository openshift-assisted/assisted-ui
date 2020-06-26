import { testInfraClusterName, assertTestClusterPresence } from './shared';

describe('Application', () => {
  it('loads', () => {
    // Set CYPRESS_BASE_URL environemnt variable
    // Example: export CYPRESS_BASE_URL=http://localhost:3000
    cy.visit('');
  });

  it('has basic structure', () => {
    cy.visit('/');

    cy.get('h1').contains('Managed Clusters');
    cy.get('.pf-c-brand').should(
      'have.attr',
      'alt',
      'OpenShift Container Platform Assisted Installer',
    );
    cy.get('#button-feedback').contains('Provide feedback'); // TODO(mlibra): check link

    cy.get('#button-about').contains('About');

    cy.get('#button-create-new-cluster').contains('Create New Cluster');
  });

  describe('makes sure about expected initial state before testing', () => {
    it(`one of the present clusters is "${testInfraClusterName}"`, () => {
      assertTestClusterPresence(cy);
    });
    // TODO(mlibra): verify additional presumptions about initial state prior running other tests
  });
});
