describe('Managed Clusters list', () => {
  beforeEach(() => {
    cy.visit('/clusters');
  });

  it('can render', () => {
    cy.get('h1').contains('Managed Clusters');
  });

  it('has list of clusters with visible columns', () => {
    cy.get('th > button.pf-m-plain').first().contains('Name');
    cy.get('th > button.pf-m-plain').last().contains('Hosts');
    cy.get('[data-label="ID"] > .pf-c-button');
    cy.get('[data-label="Version"] > .pf-c-button');
    cy.get('[data-label="Status"] > .pf-c-button');
  });

  it('has single cluster with correct details', () => {
    cy.get('[data-label="Name"] > a').should('have.length', 1);
    cy.get('[data-label="Name"] > a').contains('ostest');
    cy.get('tbody > tr > [data-label="ID"]').should('not.be.empty');
    cy.get('tbody > tr > [data-label="Version"]').should('not.be.empty');
    cy.get('tbody > tr > [data-label="Version"]').contains('4.4'); // to raise attention when source data changes
    cy.get('tbody > tr > [data-label="Status"]').should('not.be.empty');
    // cy.get('tbody > tr > [data-label="Status"]').contains('known'); // TODO(mlibra):
    cy.get('tbody > tr > [data-label="Hosts"]').contains('4');
  });

  it('can create and delete dummy cluster', () => {
    // still single cluster in the list
    cy.get('#pf-toggle-id-0').click(); // open kebab
    cy.get('.pf-c-dropdown__menu-item').should('have.length', 1);

    // create
    cy.get('.pf-l-toolbar__item > .pf-c-button').click();
    cy.get('.pf-c-modal-box'); // modal visible
    cy.get('.pf-c-title').contains('New Bare Metal OpenShift Cluster');
    cy.get('.pf-m-secondary').click(); // cancel

    cy.get('.pf-c-modal-box').should('not.be.visible'); // modal closed
    cy.get('.pf-l-toolbar__item > .pf-c-button').click();
    cy.get('.pf-c-modal-box'); // modal visible

    const clusterName = 'test-dummy-cluster';
    cy.get('#form-input-name-field').type(`{selectall}{backspace}${clusterName}`);
    cy.get('.pf-c-modal-box__footer > .pf-m-primary').click();

    // Cluster configuration
    cy.get('.pf-c-breadcrumb__list > :nth-child(2)').contains(clusterName);
    cy.get('#form-input-name-field').should('have.value', clusterName);
    cy.get(':nth-child(3) > .pf-l-toolbar__item > .pf-c-button').click(); // Close button

    // Managed Clusters list
    cy.get('[data-label="Name"] > a').should('have.length', 2);
    cy.get(':nth-child(2) > [data-label="Name"]').contains(clusterName);
    cy.get(':nth-child(2) > [data-label="Version"]').contains('4.4');
    cy.get(':nth-child(2) > [data-label="Status"]').contains('insufficient');
    cy.get(':nth-child(2) > [data-label="Hosts"]').contains(0);

    // sorting
    cy.get(':nth-child(1) > [data-label="Name"] > a').contains('ostest');
    cy.get(':nth-child(2) > [data-label="Name"] > a').contains(clusterName);
    cy.get('.pf-m-selected > .pf-c-button').click();
    cy.get(':nth-child(2) > [data-label="Name"] > a').contains('ostest');
    cy.get(':nth-child(1) > [data-label="Name"] > a').contains(clusterName);
    cy.get('.pf-m-selected > .pf-c-button').click();
    cy.get(':nth-child(1) > [data-label="Name"] > a').contains('ostest');
    cy.get(':nth-child(2) > [data-label="Name"] > a').contains(clusterName);

    // Delete
    cy.get('#pf-toggle-id-21').click(); // open kebab menu
    cy.get('.pf-c-dropdown__menu-item').click(); // Delete
    // TODO(mlibra): bug - confirmation modal should appear (not implemented so far)
    cy.get('[data-label="Name"] > a').should('have.length', 1);
    cy.get('[data-label="Name"] > a').contains('ostest');
    // we are back to inital state with just a single cluster
  });
});
