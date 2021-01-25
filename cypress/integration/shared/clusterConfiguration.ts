import {
  DEFAULT_SAVE_BUTTON_TIMEOUT,
  HOST_REGISTRATION_TIMEOUT,
  VALIDATE_CHANGES_TIMEOUT,
} from './constants';
import { DNS_DOMAIN_NAME, NUM_MASTERS, NUM_WORKERS } from './variables';

export const hostDetailSelector = (shiftedRowIndex: number, label: string) =>
  // NOTE: The first row is number 2! Shift your indexes...
  `table > tbody:nth-child(${shiftedRowIndex}) > tr:nth-child(1) > [data-label="${label}"]`;

export const hostsTableHeaderSelector = (label: string) =>
  `table.hosts-table th[data-label="${label}"] > .pf-c-table__button`;

export const actualSorterSelector = 'table.hosts-table .pf-m-selected > .pf-c-table__button';

// TODO(mlibra): simplify selectors
// Host detail must be expanded
// hostRow - 1 for first host, 3 for the second one
export const nicsTableHeaderSelector = (hostRow: number, label: string) =>
  `#expanded-content${hostRow} > .pf-c-table__expandable-row-content > .pf-l-grid > :nth-child(8) > .pf-c-table > thead > tr > [data-label="${label}"]`;
export const nicsTableCellSelector = (hostRow: number, row: number, label: string) =>
  `#expanded-content${hostRow} > .pf-c-table__expandable-row-content > .pf-l-grid > :nth-child(8) > .pf-c-table > tbody > tr:nth-child(${row}) > [data-label="${label}"]`;
export const disksTableHeaderSelector = (hostRow: number, label: string) =>
  `#expanded-content${hostRow} > .pf-c-table__expandable-row-content > .pf-l-grid > :nth-child(6) > .pf-c-table > thead > tr > [data-label="${label}"]`;
export const disksTableCellSelector = (hostRow: number, row: number, label: string) =>
  `#expanded-content${hostRow} > .pf-c-table__expandable-row-content > .pf-l-grid > :nth-child(6) > .pf-c-table > tbody > tr:nth-child(${row}) > [data-label="${label}"]`;

export const checkValidationMessage = (cy: Cypress.cy, expectedMsg: string) => {
  cy.get(':nth-child(5) > [data-pf-content="true"] > .pf-c-button').contains(
    'The cluster is not ready to be installed yet',
  );

  cy.get('.pf-c-alert-group').should('not.exist');
  cy.get(':nth-child(5) > [data-pf-content="true"] > .pf-c-button').click();
  cy.get('.pf-c-alert').should('be.visible');
  cy.get('.pf-c-alert__description').contains(expectedMsg);

  // Close
  cy.get('.pf-l-split > :nth-child(2) > .pf-c-button').click(); // close alerts
  cy.get('.pf-c-alert').should('not.exist');
};

export const setClusterDnsDomain = (
  cy: Cypress.cy,
  dnsDomain = DNS_DOMAIN_NAME,
  isEmpty = false,
) => {
  // set the cluster DNS domain name
  cy.get('#form-input-baseDnsDomain-field').clear();
  if (isEmpty == false) {
    cy.get('#form-input-baseDnsDomain-field').type(dnsDomain);
    cy.get('#form-input-baseDnsDomain-field').should('have.value', dnsDomain);
  }
};

export const saveClusterDetails = (cy: Cypress.cy) => {
  // click the 'save' button in order to save changes in the cluster info
  cy.get('button[name="save"]', { timeout: VALIDATE_CHANGES_TIMEOUT }).should('be.enabled');
  cy.intercept({
    method: 'PATCH',
    url: '/api/assisted-install/v1/clusters/', // substring comparision
  }).as('patchCheck');
  cy.get('button[name="save"]').click();

  cy.wait('@patchCheck', { timeout: DEFAULT_SAVE_BUTTON_TIMEOUT });
  cy.wait(2 * 1000);
};

export const waitForHostTablePopulation = (
  cy: Cypress.cy,
  numMasters = NUM_MASTERS,
  numWorkers = NUM_WORKERS,
) => {
  // wait for hosts to boot and populated in table
  cy.get('table.hosts-table > tbody', { timeout: HOST_REGISTRATION_TIMEOUT }).should(($els) => {
    expect($els.length).to.be.eq(numMasters + numWorkers);
  });
};

export const setHostsRole = (
  cy: Cypress.cy,
  masterHostnamePrefix: string,
  workerHostnamePrefix: string,
  numMasters = NUM_MASTERS,
  numWorkers = NUM_WORKERS,
) => {
  // set hosts role
  cy.get('#form-input-name-field').click().type('{end}{home}');
  for (let i = 2; i < 2 + numMasters; i++) {
    const toggleSelector = `role-${masterHostnamePrefix}-${i - 2}-dropdown-toggle-items`;
    cy.get('#' + toggleSelector).click();
    cy.get(`ul[aria-labelledby=${toggleSelector}] > li#master`).click();
  }
  for (let i = 2 + numMasters; i < 2 + numMasters + numWorkers; i++) {
    const toggleSelector = `role-${workerHostnamePrefix}-${
      i - numMasters - 2
    }-dropdown-toggle-items`;
    cy.get('#' + toggleSelector).click();
    cy.get(`ul[aria-labelledby=${toggleSelector}] > li#worker`).click();
  }
};
