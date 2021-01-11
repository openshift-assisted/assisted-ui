import { mockAfter, mockBeforeEach, createMockContext } from './mocks';

describe('About modal', () => {
  const mockContext = createMockContext();
  beforeEach(mockBeforeEach(mockContext));
  after(mockAfter(mockContext));

  it('is rendered', () => {
    cy.visit('/');
    cy.get('h1').contains('Assisted Bare Metal Clusters');

    // open About dialog
    cy.get('#button-about').contains('About');
    cy.get('#button-about').click();
    cy.get('div.pf-c-about-modal-box').should('be.visible');

    // structure
    cy.get('#ui-lib-version-title').contains('Assisted Installer UI version');

    // close
    cy.get('.pf-c-about-modal-box__close > .pf-c-button').click();
  });
});
