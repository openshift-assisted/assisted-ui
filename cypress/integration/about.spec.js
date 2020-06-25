describe('About modal', () => {
  it('is rendered', () => {
    cy.visit('/');

    // open
    cy.get('div.pf-c-about-modal-box').should('not.be.visible');
    cy.get('#button-about').contains('About');
    cy.get('#button-about').click();
    cy.get('div.pf-c-about-modal-box').should('be.visible');

    // structure
    // TODO(mlibra): test content of the modal

    // close
    cy.get('.pf-c-about-modal-box__close > .pf-c-button').click();
    cy.get('div.pf-c-about-modal-box').should('not.be.visible');
  });
});
