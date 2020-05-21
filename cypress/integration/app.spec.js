import { assertSingleClusterOnly, testInfraClusterName } from './shared';

describe('Application', () => {
  it('loads', () => {
    // Set CYPRESS_BASE_URL environemnt variable
    // Example: export CYPRESS_BASE_URL=http://localhost:3000
    cy.visit('');
  });

  it('has navigation burger bar menu', () => {
    cy.visit('/');
    cy.get('#page-sidebar').should('have.class', 'pf-m-collapsed');
    cy.get('#nav-toggle').click();
    cy.get('#page-sidebar').should('have.class', 'pf-m-expanded');
    cy.get('#nav-toggle').click();
    cy.get('#page-sidebar').should('not.have.class', 'pf-m-expanded');
    cy.get('#page-sidebar').should('have.class', 'pf-m-collapsed');
  });

  describe('makes sure about expected initial state before testing', () => {
    it(`just a single "${testInfraClusterName}" cluster is present`, () => {
      assertSingleClusterOnly(cy);
    });
    // TODO(mlibra): verify additional presumptions about initial state prior running other tests
  });
});
