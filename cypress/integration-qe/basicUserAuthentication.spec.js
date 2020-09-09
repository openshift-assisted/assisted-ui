import { verifyPullSecretHosted } from './ocmShared';

describe('test basic user authentication', () => {
  it('navigate from openshift portal to assisted installer', () => {
    cy.visit('');
    cy.get('[aria-current="page"]').contains('Clusters').click();
    cy.contains('Create cluster').click();
    cy.get('[href="/openshift/install"').click();
    cy.get('[href="/openshift/install/metal"').click();
    cy.contains('Assisted Bare Metal Installer').should('exist');
  });

  it('verify autofilled pull secret matches user pull secret', () => {
    cy.contains('Assisted Bare Metal Installer').click();
    verifyPullSecretHosted();
    cy.contains('Cancel').click();
  });
});
