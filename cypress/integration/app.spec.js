describe('Application', () => {
  it('loads', () => {
    // Set CYPRESS_BASE_URL environemnt variable
    // Example: export CYPRESS_BASE_URL=http://localhost:3000
    cy.visit('');
  });

  it('has Managed Clusters', () => {
    cy.visit('/clusters');

    // columns visible
    cy.get('h1').contains('Managed Clusters');
    cy.get('th > button.pf-m-plain').first().contains('Name');
    cy.get('th > button.pf-m-plain').last().contains('Hosts');
    cy.get('[data-label="ID"] > .pf-c-button');
    cy.get('[data-label="Version"] > .pf-c-button');
    cy.get('[data-label="Status"] > .pf-c-button');
  });
});
