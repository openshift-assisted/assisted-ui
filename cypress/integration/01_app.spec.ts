describe('Application', () => {
  it('loads', () => {
    // Set CYPRESS_BASE_URL environemnt variable
    // Example: export CYPRESS_BASE_URL=http://localhost:3000
    cy.visit('');
    cy.get('h1').contains('Assisted Bare Metal Clusters');
  });

  it('has basic structure', () => {
    cy.visit('/');

    cy.get('h1').contains('Assisted Bare Metal Clusters');
    cy.get('.pf-c-brand').should(
      'have.attr',
      'alt',
      'OpenShift Container Platform Assisted Installer',
    );

    cy.get('#button-feedback').contains('Provide feedback');

    cy.get('#button-about').contains('About');
    cy.get('#search-string').should(
      'have.attr',
      'placeholder',
      'Filter by Name, ID or Base domain',
    );
    cy.get('button[data-ouia-id="button-create-new-cluster"]').contains('Create Cluster');
  });
});
