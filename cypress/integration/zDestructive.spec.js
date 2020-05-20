// Theese tests changes state of the cluster permanently
// If enabled, they are called at last.
describe('Destructive tests need to be enabled manually', () => {
  // TODO(mlibra): Cluster ends up in insufficient state.
  xit('downloads ISO', () => {
    const proxyURLSelector = '#form-input-proxyURL-field';
    const proxyURLSelectorHelper = '#form-input-proxyURL-field-helper';
    const sshPublicKeySelector = ':nth-child(3) > #form-input-sshPublicKey-field';

    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(2) > .pf-c-button').click(); // Download ISO button
    cy.get('.pf-c-modal-box'); // modal visible
    cy.get('.pf-c-title').contains('Download discovery ISO');
    cy.get('.pf-c-modal-box__footer > .pf-m-link').click(); // cancel
    cy.get('.pf-c-modal-box').should('not.be.visible'); // modal closed

    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(2) > .pf-c-button').click(); // Download ISO button
    cy.get('.pf-c-title').contains('Download discovery ISO');
    cy.get(proxyURLSelector).type('{selectall}{backspace}foobar');
    cy.get(sshPublicKeySelector).focus();
    cy.get(proxyURLSelectorHelper).contains('Provide a valid URL.'); // validation error
    cy.get(proxyURLSelector).type('{selectall}{backspace}http://foo.com/bar');
    cy.get(sshPublicKeySelector).focus();
    cy.get(proxyURLSelectorHelper).contains('HTTP proxy URL'); // correct

    cy.get(sshPublicKeySelector).type('ssh-rsa AAAAAAAAdummykey'); // TODO(mlibra): bug - missing validation

    cy.get('.pf-c-modal-box__footer > .pf-m-primary').click(); // in-modal DOwnload ISO button
    cy.get('.pf-c-title').contains('Download discovery ISO');
    cy.get('.pf-c-empty-state__body').contains('Discovery image is being prepared');

    // TODO(mlibra): verify actual file download

    cy.get('.pf-c-empty-state__secondary > .pf-c-button').click(); // Cancel
    cy.get('.pf-c-modal-box').should('not.be.visible'); // modal closed
  });
});
