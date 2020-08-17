import {
  DEFAULT_API_REQUEST_TIMEOUT,
  VALIDATE_CHANGES_TIMEOUT,
  INSTALL_PREPARATION_TIMEOUT,
  CLUSTER_CREATION_TIMEOUT,
} from './constants';

export const testInfraClusterName = 'test-infra-cluster';
export const testInfraClusterHostnames = [
  'test-infra-cluster-master-0',
  'test-infra-cluster-master-1',
  'test-infra-cluster-master-2',
];

export const withValueOf = (cy, selector, handler) => {
  cy.get(selector).then((elem) => handler(elem[0].innerText));
};

export const getClusterNameLinkSelector = (clusterName) => `#cluster-link-${clusterName}`;
export const testClusterLinkSelector = getClusterNameLinkSelector(testInfraClusterName);
export const clusterNameLinkSelector = '[data-label="Name"] > a'; // on '/clusters' page
// const singleClusterCellSelector = (column) => `tbody > tr > [data-label="${column}"]`;
export const clusterTableCellSelector = (row, column) =>
  `tbody > tr:nth-child(${row}) > [data-label="${column}"]`;
export const hostDetailSelector = (row, label) =>
  // NOTE: The first row is number 2! Shift your indexes...
  `table > tbody:nth-child(${row}) > tr:nth-child(1) > [data-label="${label}"]`;

export const PULL_SECRET = Cypress.env('PULL_SECRET');
export const SSH_PUB_KEY = Cypress.env('SSH_PUB_KEY');
export const CLUSTER_NAME = Cypress.env('CLUSTER_NAME');
export const DNS_DOMAIN_NAME = Cypress.env('DNS_DOMAIN_NAME');
export const API_VIP = Cypress.env('API_VIP');
export const INGRESS_VIP = Cypress.env('INGRESS_VIP');
export const NUM_MASTERS = parseInt(Cypress.env('NUM_MASTERS'));
export const NUM_WORKERS = parseInt(Cypress.env('NUM_WORKERS'));
export const INTEGRATION_API_BASE_URL = Cypress.env('INTEGRATION_API_BASE_URL');
export const STAGING_API_BASE_URL = Cypress.env('STAGING_API_BASE_URL');
export const PRODUCTION_API_BASE_URL = Cypress.env('PRODUCTION_API_BASE_URL');
export const HOSTED_ENV = Cypress.env('HOSTED_ENV');
export const OCM_USER = Cypress.env('OCM_USER');
export const OCM_USER_PASSWORD = Cypress.env('OCM_USER_PASSWORD');

// workaround for long text, expected to be copy&pasted by the user
export const pasteText = (cy, selector, text) => {
  cy.get(selector).then((elem) => {
    elem.text(text);
    elem.val(text);
    cy.get(selector).type(' {backspace}');
  });
};

export const openCluster = (clusterName) => {
  // Click the cluster name from the clusters list
  cy.visit('');
  cy.get(getClusterNameLinkSelector(clusterName)).click();
  // Cluster configuration - name
  cy.get('.pf-c-breadcrumb__list > :nth-child(2)').contains(clusterName);
  cy.get('#form-input-name-field').should('have.value', clusterName);
};

export const createCluster = (clusterName, pullSecret) => {
  cy.visit('');
  cy.get('#button-create-new-cluster').click();
  cy.get('#form-input-name-field').should('be.visible');
  cy.get('#form-input-name-field').clear();
  cy.get('#form-input-name-field').type(clusterName);
  cy.get('#form-input-name-field').should('have.value', clusterName);
  // feed in the pull secret
  cy.get('#form-input-pullSecret-field').clear();
  pasteText(cy, '#form-input-pullSecret-field', pullSecret);
  cy.get('form').submit();
  cy.get('#button-download-discovery-iso').should('be.visible');
  cy.get('#form-input-name-field').should('have.value', clusterName);
};

export const createDummyCluster = (cy, clusterName) => {
  cy.get('#button-create-new-cluster').click();
  cy.get('.pf-c-modal-box'); // modal visible
  cy.get('.pf-c-modal-box__header').contains('New Bare Metal OpenShift Cluster');
  cy.get('.pf-m-secondary').click(); // cancel

  cy.get('.pf-c-modal-box').should('not.be.visible'); // modal closed
  cy.get('#button-create-new-cluster').click();
  cy.get('.pf-c-modal-box'); // modal visible again

  // do not allow two clusters of the same name
  cy.get('#form-input-name-field').type(`{selectall}{backspace}${testInfraClusterName}`);
  cy.get('#form-input-pullSecret-field').clear();
  pasteText(cy, '#form-input-pullSecret-field', PULL_SECRET);
  cy.get('.pf-c-modal-box__footer > .pf-m-primary').click();
  cy.get('#form-input-name-field-helper').contains('is already taken');

  // type correct dummy cluster name
  cy.get('#form-input-name-field').type(`{selectall}{backspace}${clusterName}`);
  cy.get('.pf-c-modal-box__footer > .pf-m-primary').click();

  // Cluster configuration
  cy.get('.pf-c-breadcrumb__list > :nth-child(2)').contains(clusterName);
  cy.get('#form-input-name-field').should('have.value', clusterName);

  // Close
  cy.get(':nth-child(4) > .pf-c-button').click();
};

export const deleteDummyCluster = (cy, tableRow, clusterName) => {
  const kebabSelector = `tbody > tr:nth-child(${tableRow}) > td.pf-c-table__action > div`;
  cy.get(kebabSelector).click(); // open kebab menu
  cy.get(`#button-delete-${clusterName}`).click(); // Delete & validate correct kebab from previous step
  cy.get('[data-test-id="delete-cluster-submit"]').click();

  cy.get(getClusterNameLinkSelector(clusterName)).should('not.exist');
  cy.get(testClusterLinkSelector); // validate that the test-infra-cluster is still present
};

export const generateIso = (sshPubKey) => {
  // click to download the discovery iso
  cy.get('#button-download-discovery-iso').click();
  // see that the modal popped up
  cy.get('h1#pf-modal-part-8').should('be.visible');
  // feed in the public ssh key
  pasteText(cy, '#form-input-sshPublicKey-discovery-field', sshPubKey);
  let aborted = false;
  cy.server({
    onAnyAbort: (...args) => {
      aborted = true;
      console.log('-- onAnyAbort: ', ...args);
    },
  });
  cy.get('.pf-c-modal-box__footer > .pf-m-primary').contains('Get Discovery ISO');
  cy.get('.pf-c-modal-box__footer > .pf-m-primary').click();
  // cy.get('.pf-c-modal-box__footer > .pf-m-primary', { timeout: 5 * 60 * 1000 });
  // bug: cy.get() timeout is ignored since former inner XHR is aborted by Cypress
  cy.wait(90 * 1000).then(() => {
    // yield potentially onAnyAbort()
    if (aborted) {
      cy.log('Long-running XHR was aborted');
      cy.get('.pf-c-alert').contains('Failed to download');
      cy.get('.pf-c-modal-box__footer > .pf-m-primary').contains('Get Discovery ISO', {
        timeout: 5 * 60 * 1000,
      });
      cy.get('.pf-c-modal-box__footer > .pf-m-primary').click();
    } else {
      cy.log('Waiting for ISO was successful');
    }
    cy.get('.pf-c-modal-box__footer > .pf-m-primary').contains('Download Discovery ISO');
  });
  cy.get('#pf-modal-part-7 > footer > button.pf-c-button.pf-m-secondary').click(); // now close the dialog
};

export const assertTestClusterPresence = (cy) => {
  cy.visit('/clusters');
  cy.get(testClusterLinkSelector).contains(testInfraClusterName);
  cy.get(clusterTableCellSelector(1, 'Base domain')).contains('redhat.com');
  cy.get(clusterTableCellSelector(1, 'Version')).contains('4.5'); // fail to raise attention when source data changes
  cy.get(clusterTableCellSelector(1, 'Status')).contains('Ready', {
    timeout: DEFAULT_API_REQUEST_TIMEOUT,
  });
  cy.get(clusterTableCellSelector(1, 'Hosts')).contains(3);
};

export const visitTestCluster = (cy) => {
  assertTestClusterPresence(cy);
  cy.visit('/clusters');
  cy.get(testClusterLinkSelector).click();
};

export const checkValidationMessage = (cy, expectedMsg) => {
  cy.get(':nth-child(5) > [data-pf-content="true"] > .pf-c-button').contains(
    'The cluster is not ready to be installed yet',
  );

  cy.get('.pf-c-alert').should('not.be.visible');
  cy.get(':nth-child(5) > [data-pf-content="true"] > .pf-c-button').click();
  cy.get('.pf-c-alert').should('be.visible');
  cy.get('.pf-c-alert__description').contains(expectedMsg);

  // Close
  cy.get('.pf-l-split > :nth-child(2) > .pf-c-button').click(); // close alerts
  cy.get('.pf-c-alert').should('not.be.visible');
};

export const startClusterInstallation = () => {
  // wait up to 10 seconds for the install button to be enabled
  cy.get('button[name="install"]', { timeout: VALIDATE_CHANGES_TIMEOUT }).should(($elem) => {
    expect($elem).to.be.enabled;
  });
  cy.get('button[name="install"]').click();
  // wait for the progress description to say "Installing" [temporarily comented out because
  // there is no div.pf-c-progress__description any more...]
  // cy.contains('div.pf-c-progress__description', 'Installing', {
  //   timeout: INSTALL_PREPARATION_TIMEOUT,
  // });
};

export const waitForClusterInstallation = () => {
  // wait up to 1 hour for the progress description to say "Installed"
  cy.contains('div.pf-c-progress__description', 'Installed', { timeout: CLUSTER_CREATION_TIMEOUT });
};

export const loginOCM = (userName, password) => {
  //Login to ocm
  cy.visit('');
  cy.get('#username').should('be.visible');
  cy.get('#username').type(userName);
  cy.get('#username').should('have.value', userName);
  cy.get('#login-show-step2').click();
  cy.get('#password').should('be.visible');
  cy.get('#password').type(password);
  cy.get('#password').should('have.value', password);
  cy.get('#kc-form-login').submit();

  // visit ocm environment specified by CYPRESS_HOST_ENV
  switch (HOSTED_ENV) {
    case 'staging':
      cy.visit('');
      break;
    case 'integration':
      cy.visit('', {
        qs: {
          env: 'integration',
        },
      });
      break;
    case 'production':
      break;
  }
};

export const makeApiCall = (apiPostfix, method, responseHandler, requestBody = {}) => {
  let apiBaseURL = '';
  // determine ocm api to request user pull secret for comparison
  switch (HOSTED_ENV) {
    case 'staging':
      apiBaseURL = STAGING_API_BASE_URL;
      break;
    case 'integration':
      apiBaseURL = INTEGRATION_API_BASE_URL;
      break;
    case 'production':
      apiBaseURL = PRODUCTION_API_BASE_URL;
      break;
  }

  // get ocm api token from cookies
  cy.getCookie('cs_jwt').then((cookie) => {
    const token = cookie.value;
    const authHeader = {
      Authorization: `Bearer ${token}`,
    };
    const requestOptions = {
      method: method,
      url: `${apiBaseURL}${apiPostfix}`,
      headers: authHeader,
      body: requestBody,
    };

    // request user pull secret
    cy.request(requestOptions).then(responseHandler); 
  });
};

// verifies auto-filled pull secret matches loged in user's pull secret
export const verifyPullSecret = () => {
  // response handler for makeApiCall
  const comparePullSecret = (response) => {
    const userPullSecret = JSON.stringify(response.body);
    cy.get('#form-input-pullSecret-field').should('have.value', userPullSecret);
  };

  makeApiCall('api/accounts_mgmt/v1/access_token', 'post', comparePullSecret);
};

export const createClusterHosted = (clusterName) => {
  // navigate from ocm portal to assisted installer
  cy.get('button').contains('Create cluster').click();
  cy.get('[href="/openshift/install"').click();
  cy.get('[href="/openshift/install/metal"').click();
  cy.get('[data-testid="ai-button"]').click();
  verifyPullSecret();
  cy.get('#form-input-name-field').clear();
  cy.get('#form-input-name-field').type(clusterName);
  cy.get('form').submit();
  cy.get('#button-download-discovery-iso').should('be.visible');
  cy.get('#form-input-name-field').should('have.value', clusterName);
};

export const logOutOCM = () => {
  cy.get('#UserMenu').as('userMenu');
  cy.get('@userMenu').click();
  cy.contains('Log out').click();
};

// verifies cluster was created and associated to user
export const verifyClusterCreation = (clusterName) => {
  // response handler for makeApiCall
  const findClusterInList = (response) => {
    const clusters = response.body;
    const checkClusterName = (cluster) => clusterName.localeCompare(cluster.name) === 0;

    cy.expect(clusters.some(checkClusterName)).to.be.true;
  };

  makeApiCall('api/assisted-install/v1/clusters', 'get', findClusterInList);
};

export const saveClusterDetails = (cy) => {
  // click the 'save' button in order to save changes in the cluster info
  cy.get('button[name="save"]', { timeout: VALIDATE_CHANGES_TIMEOUT }).should('be.enabled');
  cy.get('button[name="save"]').click();
};
