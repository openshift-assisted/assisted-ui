import { makeApiCall, API_BASE_URL } from './shared';
import { DEFAULT_API_REQUEST_TIMEOUT } from './constants';

export const INTEGRATION_ENV = Cypress.env('INTEGRATION_ENV');
export const OCM_USER = Cypress.env('OCM_USER');
export const OCM_USER_PASSWORD = Cypress.env('OCM_USER_PASSWORD');
export const OCM_COOKIE_NAME = Cypress.env('OCM_COOKIE_NAME');
export const OCM_TOKEN_DEST = Cypress.env('OCM_TOKEN_DEST');

export const loginOCM = (userName, password) => {
  // visit ocm environemnt based on INTEGRATION_ENV (true/false)
  // cy.visit does not direct to the correct env based on baseUrl query string
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

  cy.get('#button-create-new-cluster', {
    timeout: DEFAULT_API_REQUEST_TIMEOUT,
  });
};

export const writeCookieToDisk = async () => {
  cy.getCookie(OCM_COOKIE_NAME).then((cookie) => {
    // dumping cookie to disk
    cy.exec(`echo '${cookie.value}' > ${OCM_TOKEN_DEST}`);
  });
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
  cy.get('button[id="UserMenu"]').click();
  cy.contains('Log out').click();
};

export const loginAndPreserveEnvironment = () => {
  before(() => {
    cy.request({
      method: 'GET',
      url: `${API_BASE_URL}/api/accounts_mgmt/v1/access_token`,
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 401) {
        loginOCM(OCM_USER, OCM_USER_PASSWORD);
      }
    });
  });

  beforeEach(() => {
    // cookies and local storage are cleared between it() blocks
    // preserving cs_jwt keeps the user logged in between tests
    Cypress.Cookies.preserveOnce(OCM_COOKIE_NAME);
    // seting ocmOverridenEnvironment preserves integration/staging environments between tests
    localStorage.setItem('ocmOverridenEnvironment', INTEGRATION_ENV ? 'integration' : '');
  });

  after(() => {
    cy.clearCookies();
  });
};
