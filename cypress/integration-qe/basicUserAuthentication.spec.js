import { verifyPullSecretHosted } from './ocmShared';

describe('test basic user authentication', () => {
  it('navigate from openshift portal to assisted installer', () => {
    cy.visit('');
    cy.get('[aria-current="page"]').contains('Clusters').click();
    cy.get('button').contains('Create cluster').click();
    cy.get('[href="/openshift/install"').click();
    cy.get('[href="/openshift/install/metal"').click();
    cy.get('[data-testid="ai-button"]').should('exist');
  });

  it('verify autofilled pull secret matches user pull secret', () => {
    cy.get('[data-testid="ai-button"]').click();
    verifyPullSecretHosted();
    cy.get('button').contains('Cancel').click();
  });
});
