import { visitOneAndOnlyCluster, testInfraClusterName } from './shared';

// Theese tests changes state of the cluster permanently.
// If enabled, they are called at last.
describe('Destructive tests need to be enabled manually', () => {
  // TODO: add more thorough checks for field-validations
  it('Cluster can be installed', () => {
    const perPageErrorMessageSelector = ':nth-child(4) > .pf-l-toolbar__item'; // bottom toolbar, small red text
    const installClusterButtonSelector = '.pf-l-toolbar__item > button.pf-m-primary';
    visitOneAndOnlyCluster(cy);

    // Fill-in form
    cy.get('.pf-c-breadcrumb__list > :nth-child(2)').contains(testInfraClusterName);
    cy.get('#form-input-name-field').should('have.value', testInfraClusterName);

    cy.get('#form-input-baseDnsDomain-field').type('{selectall}{backspace}foobardomain.com');

    cy.get('#form-input-clusterNetworkCidr-field').type('{selectall}{backspace}11.11.11.0');
    cy.get('#form-input-clusterNetworkHostPrefix-field').focus(); // to execute validation
    cy.get('#form-input-clusterNetworkCidr-field-helper').contains('is not valid IP block address'); // validation error
    cy.get(perPageErrorMessageSelector).should('have.length', 1);
    cy.get(perPageErrorMessageSelector).contains('There are validation errors.');
    cy.get(installClusterButtonSelector).should('have.length', 1);
    cy.get(installClusterButtonSelector).should('be.disabled');
    cy.get('#form-input-clusterNetworkCidr-field').type('{selectall}{backspace}11.11.11.0/24');
    cy.get('#form-input-clusterNetworkCidr-field-helper').contains(
      'IP address block from which Pod IPs are allocated',
    ); // validation passed
    cy.get(perPageErrorMessageSelector).should('have.length', 0);
    cy.get(installClusterButtonSelector).should('not.be.disabled');

    cy.get('#form-input-clusterNetworkHostPrefix-field').type('{selectall}{backspace}23');

    cy.get('#form-input-serviceNetworkCidr-field').type('{selectall}{backspace}11.11.11.0');
    cy.get('#form-input-clusterNetworkHostPrefix-field').focus();
    cy.get('#form-input-serviceNetworkCidr-field-helper').contains('is not valid IP block address'); // validation error
    cy.get('#form-input-serviceNetworkCidr-field').type('{selectall}{backspace}11.11.12.0/24');
    cy.get('#form-input-serviceNetworkCidr-field-helper').contains(
      'The IP address pool to use for service IP addresses.',
    ); // validation passed

    cy.get('#form-input-apiVip-field').type('{selectall}{backspace}1.1.1.1');

    cy.get('#form-input-ingressVip-field').type('{selectall}{backspace}1.1.1.1');
    cy.get('#form-input-pullSecret-field').type('{selectall}{backspace}{nonparseable');
    cy.get('#form-input-ingressVip-field').focus();
    cy.get('#form-input-pullSecret-field-helper').contains('Value must be valid JSON.'); // validation error
    cy.get('#form-input-pullSecret-field').type('{selectall}{backspace}{}');

    cy.get('#form-input-sshPublicKey-field').type('{selectall}{backspace}nonsense');
    cy.get('#form-input-pullSecret-field').focus();
    cy.get('#form-input-sshPublicKey-field-helper').contains(
      'SSH public key must consist of "ssh-rsa key [email]"',
    ); // validation error
    cy.get(installClusterButtonSelector).should('have.length', 1);
    cy.get(installClusterButtonSelector).should('be.disabled');
    cy.get('#form-input-sshPublicKey-field').type(
      '{selectall}{backspace}ssh-rsa AAAAB3NzaFOOOOOOOBAAAAAAAAAR someone@here.cz',
    );

    // Install
    cy.get(installClusterButtonSelector).should('not.be.disabled');
    cy.get(installClusterButtonSelector).click();
    // cy.get(perPageErrorMessageSelector).conatins('Starting installation'); TODO(mlibra): enable

    // TODO(mlibra): next steps (not working ATM)
  });
});
