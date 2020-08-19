import { makeApiCall } from './shared';

export const INTEGRATION_ENV = Cypress.env('INTEGRATION_ENV');
export const OCM_USER = Cypress.env('OCM_USER');
export const OCM_USER_PASSWORD = Cypress.env('OCM_USER_PASSWORD');
export const LOGIN = Cypress.env('LOGIN');

export const loginOCM = (userName, password) => {
  // visit ocm environemnt based on INTEGRATION_ENV (true/false)
  // cy.visit does not direct to the correct env based on baseUrl query string
  if (LOGIN) {
    const visitOptions = INTEGRATION_ENV ? { qs: { env: 'integration' } } : {};

    cy.visit('', visitOptions);
    cy.get('#username').should('be.visible');
    cy.get('#username').type(userName);
    cy.get('#username').should('have.value', userName);
    cy.get('#login-show-step2').click();
    cy.get('#password').should('be.visible');
    cy.get('#password').type(password);
    cy.get('#password').should('have.value', password);
    cy.get('#kc-form-login').submit();

    cy.get('#button-create-new-cluster');
  } else {
    cy.visit('');
  }
};

// verifies auto-filled pull secret matches loged in user's pull secret
export const verifyPullSecretHosted = () => {
  // response handler for makeApiCall
  const comparePullSecret = (response) => {
    const userPullSecret = JSON.stringify(response.body);
    cy.get('#form-input-pullSecret-field').should('have.value', userPullSecret);
  };

  makeApiCall('/api/accounts_mgmt/v1/access_token', 'post', comparePullSecret);
};

export const logOutOCM = () => {
  cy.get('userMenu').click();
  cy.contains('Log out').click();
};
