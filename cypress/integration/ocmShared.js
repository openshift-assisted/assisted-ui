import { API_BASE_URL } from './shared';

export const INTEGRATION_ENV = Cypress.env('INTEGRATION_ENV');
export const OCM_USER = Cypress.env('OCM_USER');
export const OCM_USER_PASSWORD = Cypress.env('OCM_USER_PASSWORD');

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

  cy.get('#cluster-list-emptystate-primary-action');
};

export const makeApiCallHosted = (apiPostfix, method, responseHandler, requestBody = {}) => {
  // get ocm api token from cookies
  cy.getCookie('cs_jwt').then((cookie) => {
    const token = cookie.value;
    const authHeader = {
      Authorization: `Bearer ${token}`,
    };
    const requestOptions = {
      method: method,
      url: `${API_BASE_URL}${apiPostfix}`,
      headers: authHeader,
      body: requestBody,
    };

    cy.request(requestOptions).then(responseHandler);
  });
};

// verifies auto-filled pull secret matches loged in user's pull secret
export const verifyPullSecretHosted = () => {
  // response handler for makeApiCall
  const comparePullSecret = (response) => {
    const userPullSecret = JSON.stringify(response.body);
    cy.get('#form-input-pullSecret-field').should('have.value', userPullSecret);
  };

  makeApiCallHosted('/api/accounts_mgmt/v1/access_token', 'post', comparePullSecret);
};

export const createClusterHosted = (clusterName) => {
  // navigate from ocm portal to assisted installer
  cy.get('button').contains('Create cluster').click();
  cy.get('[href="/openshift/install"').click();
  cy.get('[href="/openshift/install/metal"').click();
  cy.get('[data-testid="ai-button"]').click();
  verifyPullSecretHosted();
  cy.get('#form-input-name-field').clear();
  cy.get('#form-input-name-field').type(clusterName);
  cy.get('form').submit();
  cy.get('#button-download-discovery-iso').should('be.visible');
  cy.get('#form-input-name-field').should('have.value', clusterName);
};

export const logOutOCM = () => {
  cy.get('userMenu').click();
  cy.contains('Log out').click();
};

// verifies cluster was created and associated to user
export const verifyClusterCreationHosted = (clusterName) => {
  // response handler for makeApiCall
  const findClusterInList = (response) => {
    const clusters = response.body;
    const checkClusterName = (cluster) => clusterName.localeCompare(cluster.name) === 0;

    expect(clusters.some(checkClusterName)).to.be.true;
  };

  makeApiCallHosted('/api/assisted-install/v1/clusters', 'get', findClusterInList);
};
