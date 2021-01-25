import { API_BASE_URL } from './variables';

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
