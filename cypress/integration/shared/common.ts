import { FILE_DOWNLOAD_TIMEOUT } from './constants';
import { API_BASE_URL, HTTP_PROXY, HTTPS_PROXY, NO_PROXY } from './variables';

export const withValueOf = (cy: Cypress.cy, selector: string, handler: (val1: string) => void) => {
  cy.get(selector).then((elem) => handler(elem[0].innerText));
};

// workaround for long text, expected to be copy&pasted by the user
export const pasteText = (cy: Cypress.cy, selector: string, text: string) => {
  cy.get(selector).then((elem) => {
    elem.text(text);
    elem.val(text);
    cy.get(selector).type(' {backspace}');
  });
};

export const kebabSelector = (tableRow: number, tableSelector?: string) =>
  `${tableSelector || ''} tbody > tr:nth-child(${tableRow}) > td.pf-c-table__action > div`;

export const kebabSelectorByRowId = (rowId: string) => `#${rowId} > td.pf-c-table__action > div`;

export const clusterIdFromUrl = (cy: Cypress.cy) => {
  return new Cypress.Promise((resolve) => {
    cy.url().then((url) => {
      resolve(url.split('/clusters/')[1]);
    });
  });
};

export const makeApiCall = (
  apiPostfix: string,
  method: string,
  responseHandler: (response: Cypress.Response) => void,
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
      headers: undefined,
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

// Based on API call
export const getClusterState = (cy: Cypress.cy) => {
  return new Cypress.Promise((resolve) => {
    clusterIdFromUrl(cy).then((id) => {
      const readClusterStatus = (response: Cypress.Response) => {
        resolve(response.body.status);
      };

      makeApiCall(`/api/assisted-install/v1/clusters/${id}`, 'GET', readClusterStatus);
    });
  });
};

// Based on API call
export const waitForClusterState = (cy: Cypress.cy, desiredState: string, retries = 10) => {
  getClusterState(cy).then((state) => {
    assert.isTrue(retries > 0);
    if (state !== desiredState) {
      cy.exec('sleep 5');
      waitForClusterState(cy, desiredState, retries - 1);
    }
  });
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
  cy.byDataTestID('download-iso-btn').contains('Download Discovery ISO');
  cy.byDataTestID('close-iso-btn').click(); // now close the dialog
};

export const downloadFileWithChrome = (
  downloadButton,
  resultantFilename,
  timeout = FILE_DOWNLOAD_TIMEOUT,
  postClickStep = null,
) => {
  // NOTE: This works only with Chrome, where the default behavior is:
  //  1) It starts the download without popping up a save dialog (which would require automating native windows)
  //  2) It caches to a temporary location, and when the download is complete it moves the file to ~/Downloads

  // first delete old downloads
  cy.exec(`[ -f ${resultantFilename} ] && rm -rf ${resultantFilename}`, {
    failOnNonZeroExit: false,
  });
  cy.get(downloadButton).click();

  if (postClickStep) {
    postClickStep();
  }

  // wait until the file shows up, to know that the download finshed
  cy.exec(`while [ ! -f ${resultantFilename} ]; do sleep 1; done`, {
    timeout: timeout,
  }).should((result) => {
    expect(result.code).to.be.eq(0);
  });
};

export const logAssistedUIVersion = (cy: Cypress.cy) => {
  cy.byDataTestID('assisted-ui-lib-version')
    .invoke('text')
    .then((uiVersion) => {
      if (uiVersion) {
        cy.log('assisted-ui-lib-version', uiVersion);
        cy.wait(3 * 1000);
        cy.exec(`echo UI: ${uiVersion} >> ~/test_artifacts/versions.log`);
      }
    });
};
