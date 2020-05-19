describe('Application', () => {
  it('loads', () => {
    // Set CYPRESS_BASE_URL environemnt variable
    // Example: export CYPRESS_BASE_URL=http://localhost:3000
    cy.visit('');
  });

  it('has navigation burger bar menu', () => {
    cy.get('#page-sidebar').should('have.class', 'pf-m-collapsed');
    cy.get('#nav-toggle').click();
    cy.get('#page-sidebar').should('have.class', 'pf-m-expanded');
    cy.get('#nav-toggle').click();
    cy.get('#page-sidebar').should('not.have.class', 'pf-m-expanded');
    cy.get('#page-sidebar').should('have.class', 'pf-m-collapsed');
  });
});
