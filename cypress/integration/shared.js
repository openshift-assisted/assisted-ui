import {
  DEFAULT_API_REQUEST_TIMEOUT,
  VALIDATE_CHANGES_TIMEOUT,
  CLUSTER_CREATION_TIMEOUT,
  HOST_DISCOVERY_TIMEOUT,
  HOST_REGISTRATION_TIMEOUT,
  INSTALL_PREPARATION_TIMEOUT,
  FILE_DOWNLOAD_TIMEOUT,
  START_INSTALLATION_TIMEOUT,
  DEFAULT_CREATE_CLUSTER_BUTTON_SHOW_TIMEOUT,
  DEFAULT_SAVE_BUTTON_TIMEOUT,
} from './constants';
import { resolvePlugin } from '@babel/core';

export const testInfraClusterName = 'test-infra-cluster-assisted-installer';
export const testInfraClusterHostnames = [
  'test-infra-cluster-assisted-installer-master-0',
  'test-infra-cluster-assisted-installer-master-1',
  'test-infra-cluster-assisted-installer-master-2',
];

export const withValueOf = (cy, selector, handler) => {
  cy.get(selector).then((elem) => handler(elem[0].innerText));
};

export const getClusterNameLinkSelector = (clusterName) => `#cluster-link-${clusterName}`;
export const testClusterLinkSelector = getClusterNameLinkSelector(testInfraClusterName);
export const clusterNameLinkSelector = '[data-label="Name"] > a'; // on '/clusters' page
export const kebabSelector = (tableRow) =>
  `tbody > tr:nth-child(${tableRow}) > td.pf-c-table__action > div`;
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
export const NETWORK_CIDR = Cypress.env('NETWORK_CIDR');
export const NETWORK_HOST_PREFIX = Cypress.env('NETWORK_HOST_PREFIX');
export const SERVICE_NETWORK_CIDR = Cypress.env('SERVICE_NETWORK_CIDR');
export const NUM_MASTERS = parseInt(Cypress.env('NUM_MASTERS'));
export const NUM_WORKERS = parseInt(Cypress.env('NUM_WORKERS'));
export const API_BASE_URL = Cypress.env('API_BASE_URL');
export const OCM_USER = Cypress.env('OCM_USER');
export const ISO_PATTERN = Cypress.env('ISO_PATTERN');
export const HTTP_PROXY = Cypress.env('HTTP_PROXY');
export const HTTPS_PROXY = Cypress.env('HTTPS_PROXY');
export const NO_PROXY = Cypress.env('NO_PROXY');

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
  cy.get(getClusterNameLinkSelector(clusterName), {
    timeout: DEFAULT_CREATE_CLUSTER_BUTTON_SHOW_TIMEOUT,
  }).click();
  // Cluster configuration - name
  cy.get('.pf-c-breadcrumb__list > :nth-child(3)').contains(clusterName);
  cy.get('#form-input-name-field').should('have.value', clusterName);
};

export const createDummyCluster = (cy, clusterName, pullSecret) => {
  cy.get('button[data-ouia-id="button-create-new-cluster"]', {
    timeout: DEFAULT_CREATE_CLUSTER_BUTTON_SHOW_TIMEOUT,
  }).click();
  cy.get('#form-input-name-field').should('be.visible');
  cy.get('h1').contains('Install OpenShift on Bare Metal with the Assisted Installer');

  // type correct dummy cluster name
  cy.get('#form-input-name-field').type(`{selectall}{backspace}${clusterName}`);
  cy.get('#form-input-name-field').should('have.value', clusterName);
  if (!OCM_USER) {
    cy.get('#form-input-pullSecret-field').clear();
    pasteText(cy, '#form-input-pullSecret-field', pullSecret);
  }
};

export const createCluster = (cy, clusterName, pullSecret) => {
  cy.visit('');
  createDummyCluster(cy, clusterName, pullSecret);
  cy.get('button[name="save"]').click();

  // Cluster configuration
  // cy.get('.pf-c-breadcrumb__list > :nth-child(2)').contains(clusterName);
  cy.get('#bare-metal-inventory-button-download-discovery-iso', { timeout: 10 * 1000 }).should(
    'be.visible',
  );
  cy.get('#form-input-name-field').should('have.value', clusterName);
};

export const cancelDummyCluster = (cy) => {
  cy.get('.pf-c-button.pf-m-link').click(); // cancel
  cy.get('#form-input-name-field').should('not.exist');
  cy.get('#form-input-openshiftVersion-field').should('not.exist');
  cy.get('#form-input-pullSecret-field').should('not.exist');
};

export const deleteDummyCluster = (cy, tableRow, clusterName) => {
  cy.get(kebabSelector(tableRow)).click(); // open kebab menu
  cy.get(`#button-delete-${clusterName}`).click(); // Delete & validate correct kebab from previous step
  cy.get('[data-test-id="delete-cluster-submit"]').click();

  cy.get(getClusterNameLinkSelector(clusterName)).should('not.exist');
  cy.get(testClusterLinkSelector); // validate that the test-infra-cluster is still present
};

export const setProxyValues = (httpProxy = null, httpsProxy = null, noProxy = null) => {
  cy.get('#form-input-enableProxy-field').click();
  cy.get('#form-input-httpProxy-field').should('be.visible');
  cy.get('#form-input-httpsProxy-field').should('be.visible');
  cy.get('#form-input-noProxy-field').click(); //just to scroll down to it
  cy.get('#form-input-noProxy-field').should('be.visible');

  if (httpProxy) {
    cy.get('#form-input-httpProxy-field').clear();
    cy.get('#form-input-httpProxy-field').type(httpProxy);
  }

  if (httpsProxy) {
    cy.get('#form-input-httpsProxy-field').clear();
    cy.get('#form-input-httpsProxy-field').type(httpsProxy);
  }

  if (noProxy) {
    cy.get('#form-input-noProxy-field').clear();
    cy.get('#form-input-noProxy-field').type(noProxy);
  }
};

export const generateIso = (
  sshPubKey,
  httpProxy = HTTP_PROXY,
  httpsProxy = HTTPS_PROXY,
  noProxy = NO_PROXY,
) => {
  // click to download the discovery iso
  cy.get('#bare-metal-inventory-button-download-discovery-iso').click();
  // see that the modal popped up
  // TODO waiting on new release to uncomment the below
  // cy.get('#generate-discovery-iso-modal').should('be.visible');
  cy.get('[id^=pf-modal-part]').should('be.visible');
  // feed in the public ssh key
  cy.get('#sshPublicKey').type(sshPubKey);
  let aborted = false;
  cy.server({
    onAnyAbort: (...args) => {
      aborted = true;
      console.log('-- onAnyAbort: ', ...args);
    },
  });

  if (httpProxy || httpsProxy || noProxy) {
    setProxyValues(httpProxy, httpsProxy, noProxy);
  }

  cy.get('.pf-c-modal-box__footer > .pf-m-primary').should('be.visible');
  cy.get('.pf-c-modal-box__footer > .pf-m-primary').contains('Generate Discovery ISO');
  cy.get('.pf-c-modal-box__footer > .pf-m-primary').click();
  // cy.get('.pf-c-modal-box__footer > .pf-m-primary', { timeout: 5 * 60 * 1000 });
  // bug: cy.get() timeout is ignored since former inner XHR is aborted by Cypress
  // using constant GENERATE_ISO_TIMEOUT causes a lint crash https://github.com/cypress-io/eslint-plugin-cypress/issues/43
  cy.wait(2 * 60 * 1000).then(() => {
    // yield potentially onAnyAbort()
    if (aborted) {
      cy.log('Long-running XHR was aborted');
      cy.get('.pf-c-alert').contains('Failed to download');
      cy.get('.pf-c-modal-box__footer > .pf-m-primary').contains('Generate Discovery ISO', {
        timeout: 5 * 60 * 1000,
      });
      cy.get('.pf-c-modal-box__footer > .pf-m-primary').click();
    } else {
      cy.log('Waiting for ISO was successful');
    }
  });
  cy.get('button[data-test-id="download-iso-btn"]').contains('Download Discovery ISO');
  cy.get('button[data-test-id="close-iso-btn"]').click(); // now close the dialog
};

export const downloadFileWithChrome = (
  downloadButton,
  resultantFilename,
  timeout = FILE_DOWNLOAD_TIMEOUT,
) => {
  // NOTE: This works only with Chrome, where the default behavior is:
  //  1) It starts the download without popping up a save dialog (which would require automating native windows)
  //  2) It caches to a temporary location, and when the download is complete it moves the file to ~/Downloads

  // first delete old downloads
  cy.exec(`[ -f ${resultantFilename} ] && rm -rf ${resultantFilename}`, {
    failOnNonZeroExit: false,
  });
  cy.get(downloadButton).click();

  // wait until the file shows up, to know that the download finshed
  cy.exec(`while [ ! -f ${resultantFilename} ]; do sleep 1; done`, {
    timeout: timeout,
  }).should((result) => {
    expect(result.code).to.be.eq(0);
  });
};

export const assertTestClusterPresence = (cy) => {
  cy.visit('/clusters');
  cy.get(testClusterLinkSelector).contains(testInfraClusterName);
  cy.get(clusterTableCellSelector(1, 'Base domain')).contains('redhat.com');
  cy.get(clusterTableCellSelector(1, 'Version')).contains('4.6'); // fail to raise attention when source data changes
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
  cy.get('button[name="install"]', { timeout: START_INSTALLATION_TIMEOUT }).should(($elem) => {
    expect($elem).to.be.enabled;
  });
  cy.get('button[name="install"]').click();
  // wait for the progress description to say "Installing"
  cy.contains('#cluster-progress-status-value', 'Installing', {
    timeout: INSTALL_PREPARATION_TIMEOUT,
  });
};

export const waitForClusterInstallation = () => {
  // wait up to 1 hour for the progress description to say "Installed"
  cy.contains('#cluster-progress-status-value', 'Installed', { timeout: CLUSTER_CREATION_TIMEOUT });
};

export const waitForHostTablePopulation = (
  cy,
  numMasters = NUM_MASTERS,
  numWorkers = NUM_WORKERS,
) => {
  // wait for hosts to boot and populated in table
  cy.get('table.hosts-table > tbody', { timeout: HOST_REGISTRATION_TIMEOUT }).should(($els) => {
    expect($els.length).to.be.eq(numMasters + numWorkers);
  });
};

export const waitForHostsToBeKnown = (numMasters = NUM_MASTERS, numWorkers = NUM_WORKERS) => {
  // wait until hosts are getting to pending input state
  for (let i = 2; i <= numMasters + numWorkers + 1; i++) {
    cy.contains(hostDetailSelector(i, 'Status'), 'Known', {
      timeout: HOST_DISCOVERY_TIMEOUT,
    });
  }
};

export const setClusterDnsDomain = (dnsDomain = DNS_DOMAIN_NAME, isEmpty = false) => {
  // set the cluster DNS domain name
  cy.get('#form-input-baseDnsDomain-field').clear();
  if (isEmpty == false) {
    cy.get('#form-input-baseDnsDomain-field').type(dnsDomain);
    cy.get('#form-input-baseDnsDomain-field').should('have.value', dnsDomain);
  }
};

export const setClusterSubnetCidr = (cy) => {
  // select the first subnet from list
  cy.get('#form-input-hostSubnet-field')
    .find('option')
    .then(($els) => $els.get(1).setAttribute('selected', 'selected'))
    .parent()
    .trigger('change');
};

export const setHostsRole = (numMasters = NUM_MASTERS, numWorkers = NUM_WORKERS) => {
  // set hosts role
  cy.get('#form-input-name-field').click().type('{end}{home}');
  for (let i = 2; i < 2 + numMasters; i++) {
    cy.get(hostDetailSelector(i, 'Role')).click().find('li#master').click();
  }
  for (let i = 2 + numMasters; i < 2 + numMasters + numWorkers; i++) {
    cy.get(hostDetailSelector(i, 'Role')).click().find('li#worker').click();
  }
};

export const makeApiCall = (
  apiPostfix,
  method,
  responseHandler,
  requestBody = {},
  failOnStatusCode = true,
) => {
  // get ocm api token from cookies
  cy.getCookie('cs_jwt').then((cookie) => {
    const requestOptions = {
      method: method,
      url: `${API_BASE_URL}${apiPostfix}`,
      body: requestBody,
      failOnStatusCode: failOnStatusCode,
    };

    // if token cookie is set attach to request
    if (cookie) {
      cy.log('using cookie');
      requestOptions.headers = {
        Authorization: `Bearer ${cookie.value}`,
      };
    }

    cy.request(requestOptions).then(responseHandler);
  });
};

export const clusterIdFromUrl = (cy) => {
  return new Cypress.Promise((resolve, reject) => {
    cy.url().then((url) => {
      resolve(url.split('/clusters/')[1]);
    });
  });
};

export const getDhcpVipState = (cy) => {
  return new Cypress.Promise((resolve, reject) => {
    clusterIdFromUrl(cy).then((id) => {
      const readDhcpAllocation = (response) => {
        resolve(response.body.vip_dhcp_allocation);
      };

      makeApiCall(`/api/assisted-install/v1/clusters/${id}`, 'GET', readDhcpAllocation);
    });
  });
};

export const getClusterState = (cy) => {
  return new Cypress.Promise((resolve, reject) => {
    clusterIdFromUrl(cy).then((id) => {
      const readClusterStatus = (response) => {
        resolve(response.body.status);
      };

      makeApiCall(`/api/assisted-install/v1/clusters/${id}`, 'GET', readClusterStatus);
    });
  });
};

export const getDomains = (cy) => {
  return new Cypress.Promise((resolve, reject) => {
    const readDomains = (response) => {
      resolve(response.body[0].provider);
    };

    makeApiCall(`/api/assisted-install/v1/domains`, 'GET', readDomains);
  });
};

export const waitForClusterState = (cy, desiredState, retries = 10) => {
  getClusterState(cy).then((state) => {
    assert.isTrue(retries > 0);
    if (state !== desiredState) {
      cy.exec('sleep 1');
      waitForClusterState(cy, desiredState, retries - 1);
    }
  });
};

export const saveClusterDetails = (cy) => {
  // click the 'save' button in order to save changes in the cluster info
  cy.get('button[name="save"]', { timeout: VALIDATE_CHANGES_TIMEOUT }).should('be.enabled');
  cy.server();
  cy.route({
    method: 'PATCH',
    url: '/api/assisted-install/v1/clusters/**',
  }).as('patchCheck');
  cy.get('button[name="save"]').click();

  cy.wait('@patchCheck', { timeout: DEFAULT_SAVE_BUTTON_TIMEOUT }).should((xhr) => {
    expect(xhr.status, 'successful PATCH').to.equal(201);
  });
  cy.wait(2 * 1000);
};

export const verifyClusterCreationApi = (clusterName) => {
  // response handler for makeApiCall
  const findClusterInList = (response) => {
    const clusters = response.body;
    const checkClusterName = (cluster) => clusterName.localeCompare(cluster.name) === 0;

    expect(clusters.some(checkClusterName)).to.be.true;
  };

  makeApiCall('/api/assisted-install/v1/clusters', 'get', findClusterInList);
};
