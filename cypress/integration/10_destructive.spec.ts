// TODO(mlibra): These tests are outdated and need to be adapted to latest app state

import { checkValidationMessage } from './shared/clusterConfiguration';
import { pasteText, withValueOf } from './shared/common';
import { TEST_INFRA_CLUSTER_NAME, visitTestInfraCluster } from './shared/testInfraCluster';
import { PULL_SECRET } from './shared/variables';

// Theese tests changes state of the cluster permanently.
// If enabled, they are called at last.
xdescribe(`Destructive ${TEST_INFRA_CLUSTER_NAME} tests at the end`, () => {
  // TODO: add more thorough checks for field-validations
  it('Cluster can be installed', () => {
    const installClusterButtonSelector = '.pf-c-toolbar__content-section > :nth-child(1) > button';
    const validateSaveButtonSelector = '.pf-c-toolbar__content-section > :nth-child(2) > button';

    visitTestInfraCluster(cy);

    // double-check assumptions
    cy.get(installClusterButtonSelector).contains('Install Cluster');

    // Fill-in form
    cy.log('Fill-in form');
    cy.get('.pf-c-breadcrumb__list > :nth-child(2)').contains(TEST_INFRA_CLUSTER_NAME);
    cy.get('#form-input-name-field').should('have.value', TEST_INFRA_CLUSTER_NAME);

    cy.get('#form-input-baseDnsDomain-field').type('{selectall}{backspace}foobardomain.com');

    cy.get('#networkConfigurationTypeBasic').should('have.attr', 'checked');
    cy.get('#networkConfigurationTypeAdvanced').should('not.have.attr', 'checked');

    cy.get('#form-input-hostSubnet-field').contains('192.168.126.1-192.168.126.254');
    cy.get('#form-input-apiVip-field').should('have.value', '192.168.126.100');
    cy.get('#form-input-ingressVip-field').should('have.value', '192.168.126.101');
    withValueOf(cy, '#form-input-sshPublicKey-field', (value) => value.startsWith('sshrsa '));
    cy.get('#form-input-clusterNetworkCidr-field').should('not.exist');
    cy.get('#form-input-clusterNetworkHostPrefix-field').should('not.exist');
    cy.get('#form-input-serviceNetworkCidr-field').should('not.exist');

    // switch network view
    cy.log('Switch network view');
    cy.get('#networkConfigurationTypeAdvanced').check();
    cy.get('#form-input-baseDnsDomain-field'); // should be present but must not be visible (limitation of the viewport)
    cy.get('#form-input-clusterNetworkCidr-field');
    cy.get('#form-input-clusterNetworkHostPrefix-field');
    cy.get('#form-input-serviceNetworkCidr-field');
    cy.get('#form-input-clusterNetworkCidr-field').should('have.value', '10.128.0.0/14');
    cy.get('#form-input-clusterNetworkHostPrefix-field').should('have.value', '23');
    cy.get('#form-input-serviceNetworkCidr-field').should('have.value', '172.30.0.0/16');

    // validators
    cy.log('Verify validators');
    cy.get('#form-input-clusterNetworkCidr-field').type('{selectall}{backspace}11.11.11.0');
    cy.get('#form-input-clusterNetworkHostPrefix-field').focus(); // to execute validation
    cy.get('#form-input-clusterNetworkCidr-field-helper').contains('is not valid IP block address'); // validation error
    checkValidationMessage(cy, 'Following fields have invalid value set: Cluster Network CIDR.');
    cy.get(installClusterButtonSelector).should('have.length', 1);
    cy.get(installClusterButtonSelector).should('be.disabled');
    cy.get(validateSaveButtonSelector).should('be.disabled');

    cy.get('#form-input-clusterNetworkCidr-field').type('{selectall}{backspace}11.11.11.0/24');
    cy.get('#form-input-clusterNetworkCidr-field-helper').contains(
      'IP address block from which Pod IPs are allocated',
    ); // validation passed
    cy.get(installClusterButtonSelector).should('be.disabled'); // still other errors
    cy.get(validateSaveButtonSelector).should('not.be.disabled');

    cy.get('#form-input-clusterNetworkHostPrefix-field').type('{selectall}{backspace}23');

    cy.get('#form-input-serviceNetworkCidr-field').type('{selectall}{backspace}11.11.11.0');
    cy.get('#form-input-clusterNetworkHostPrefix-field').focus();
    cy.get('#form-input-serviceNetworkCidr-field-helper').contains('is not valid IP block address'); // validation error
    cy.get('#form-input-serviceNetworkCidr-field').type('{selectall}{backspace}11.11.12.0/24');
    cy.get('#form-input-serviceNetworkCidr-field-helper').contains(
      'The IP address pool to use for service IP addresses.',
    ); // validation passed

    cy.get('#form-input-apiVip-field').type('{selectall}{backspace}192.168.126.100');

    cy.get('#form-input-ingressVip-field').type('{selectall}{backspace}192.168.126.101');
    cy.get('#form-input-pullSecret-field').type('{selectall}{backspace}{nonparseable');
    cy.get('#form-input-ingressVip-field').focus();
    cy.get('#form-input-pullSecret-field-helper').contains('Value must be valid JSON.'); // validation error
    cy.get('#form-input-pullSecret-field').type('{selectall}{backspace}{}');

    cy.get('#form-input-sshPublicKey-field').type('{selectall}{backspace}nonsense');
    cy.get('#form-input-pullSecret-field').focus();
    cy.get('#form-input-sshPublicKey-field-helper').contains(
      'SSH public key must consist of "[TYPE] key [[EMAIL]]", supported types are: ssh-rsa, ssh-ed25519, ecdsa-[VARIANT]',
    ); // validation error
    cy.get(installClusterButtonSelector).should('have.length', 1);
    cy.get(installClusterButtonSelector).should('be.disabled');
    cy.get(validateSaveButtonSelector).should('be.disabled');
    cy.get('#form-input-sshPublicKey-field').type(
      '{selectall}{backspace}ssh-rsa AAAAB3NzaFOOOOOOOBAAAAAAAAAR someone@here.cz',
    );
    cy.get('#form-input-pullSecret-field').focus();

    // Save & validate
    cy.log('Save & validate');
    cy.get(validateSaveButtonSelector).should('not.be.disabled');
    cy.get(installClusterButtonSelector).should('be.disabled'); // backend validation required
    cy.get(validateSaveButtonSelector).click();
    cy.get('.pf-c-alert__description').contains('Pull-secret has invalid format');
    cy.get('.pf-c-alert__action > .pf-c-button').click(); // close alert section

    if (!PULL_SECRET) {
      cy.log(
        'The CYPRESS_PULL_SECRET environment variable is not defined. Skipping rest of the cluster-installation flow.',
      );
      return;
    }

    // Install
    cy.log('Install');
    // Pass PULL_SECRET from CYPRESS_PULL_SECRET environment variable
    cy.get('#form-input-pullSecret-field').type('{selectall}{backspace}');
    pasteText(cy, '#form-input-pullSecret-field', PULL_SECRET);
    cy.get('#form-input-sshPublicKey-field').focus();
    cy.get(validateSaveButtonSelector).should('not.be.disabled');
    cy.get(installClusterButtonSelector).should('be.disabled');
    cy.get(validateSaveButtonSelector).click();
    cy.get(installClusterButtonSelector).should('not.be.disabled');
    cy.get(installClusterButtonSelector).click(); // Start the installation

    // TODO(mlibra): next steps (not working ATM)
  });
});
