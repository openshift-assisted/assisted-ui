import { createDummyCluster, deleteDummyCluster, assertSingleClusterOnly } from './shared';

describe('Managed Clusters list', () => {
  beforeEach(() => {
    cy.visit('/clusters');
    assertSingleClusterOnly(cy);
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
    // cy.get('tbody > tr > [data-label="Status"]').contains('known'); // TODO(mlibra): not having clean "initial state" cluster ATM
    cy.get('tbody > tr > [data-label="Hosts"]').contains('4');
  });

  it('can create and delete dummy cluster', () => {
    const clusterName = 'test-dummy-cluster';

    // still single cluster in the list
    cy.get('#pf-toggle-id-0').click(); // open kebab
    cy.get('.pf-c-dropdown__menu-item').should('have.length', 1);

    // create
    createDummyCluster(cy, clusterName);

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
    deleteDummyCluster(cy, '#pf-toggle-id-21');

    // we are back to inital state with just a single cluster
  });
});
