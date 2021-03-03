import {
  DEFAULT_SAVE_BUTTON_TIMEOUT,
  HOST_REGISTRATION_TIMEOUT,
  VALIDATE_CHANGES_TIMEOUT,
  HOSTS_DISCOVERY_TIMEOUT,
  HOST_DISCOVERY_TIMEOUT,
  HOST_ROLE_COLUMN,
  PRESS_NEXT_TIMEOUT,
} from './constants';

import { makeApiCall, clusterIdFromUrl } from './common';

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

export const waitForHostsSubnet = (cy: Cypress.cy) => {
  // wait until hosts subnet populated in the cluster details
  cy.get('#form-input-hostSubnet-field')
    .find('option', { timeout: HOST_DISCOVERY_TIMEOUT })
    .should(($els) => {
      expect($els.length).to.be.gt(0);
    })
    .and(($els) => {
      expect($els[0]).not.to.have.text('No subnets available');
    });
};

export const waitForHostsToBeReady = (
  cy: Cypress.cy,
  numMasters = NUM_MASTERS,
  numWorkers = NUM_WORKERS,
) => {
  // wait until hosts are getting to pending input state
  for (let i = 2; i <= numMasters + numWorkers + 1; i++) {
    cy.contains(hostDetailSelector(i, 'Hardware Status'), 'Ready', {
      timeout: HOSTS_DISCOVERY_TIMEOUT,
    });
  }
};

export const setClusterSubnetCidr = (cy: Cypress.cy) => {
  // select the first subnet from list
  cy.get('#form-input-hostSubnet-field')
    .find('option')
    .then(($els) => $els.get(1).setAttribute('selected', 'selected'))
    .parent()
    .trigger('change');
};

export const setHostsRole = (
  cy: Cypress.cy,
  masterHostnamePrefix: string,
  workerHostnamePrefix: string,
  numMasters = NUM_MASTERS,
  numWorkers = NUM_WORKERS,
) => {
  // set hosts role
  for (let i = 2; i < 2 + numMasters; i++) {
    const toggleSelector = `role-${masterHostnamePrefix}-${i - 2}-dropdown-toggle-items`;
    cy.get('#' + toggleSelector, { timeout: HOST_ROLE_COLUMN }).click();
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

export const getDhcpVipState = (cy: Cypress.cy) => {
  return new Cypress.Promise((resolve, reject) => {
    clusterIdFromUrl(cy).then((id) => {
      const readDhcpAllocation = (response) => {
        resolve(response.body.vip_dhcp_allocation);
      };

      makeApiCall(`/api/assisted-install/v1/clusters/${id}`, 'GET', readDhcpAllocation);
    });
  });
};

export const disableDhcpVip = (cy: Cypress.cy, apiVip = null, ingressVip = null) => {
  getDhcpVipState(cy).then((state) => {
    if (state) {
      cy.get('#form-input-vipDhcpAllocation-field').click();
    }
  });

  if (apiVip) {
    cy.get('#form-input-apiVip-field').clear();
    cy.get('#form-input-apiVip-field').type(apiVip);
  }
  if (ingressVip) {
    cy.get('#form-input-ingressVip-field').clear();
    cy.get('#form-input-ingressVip-field').type(ingressVip);
  }
};

export const enableDhcpVip = (cy: Cypress.cy) => {
  getDhcpVipState(cy).then((state) => {
    if (!state) {
      cy.get('#form-input-vipDhcpAllocation-field').click();
    }
  });
};

export const getAdvancedNetworkingState = (cy: Cypress.cy) => {
  return new Cypress.Promise((resolve, reject) => {
    clusterIdFromUrl(cy).then((id) => {
      const advancedNetworkingState = (response) => {
        // the advanced networking checkbox in the GUI is off when the
        // settings are the following hardcoded values:
        // clusterCidr = 10.128.0.0/14
        // networkPrefix = 23
        // serviceCidr = 172.30.0.0/16
        if (
          response.body.service_network_cidr == '172.30.0.0/16' &&
          response.body.cluster_network_cidr == '10.128.0.0/14' &&
          response.body.cluster_network_host_prefix == '23'
        ) {
          resolve(false);
        } else {
          resolve(true); // GUI shows advanced networking enabled
        }
      };

      makeApiCall(`/api/assisted-install/v1/clusters/${id}`, 'GET', advancedNetworkingState);
    });
  });
};

export const enableAdvancedNetworking = (
  cy: Cypress.cy,
  clusterCidr = null,
  networkPrefix = null,
  serviceCidr = null,
) => {
  getAdvancedNetworkingState(cy).then((state) => {
    if (!state) {
      cy.get('#useAdvancedNetworking').click();
      cy.get('#useAdvancedNetworking').should('have.prop', 'checked');
    }
  });
  cy.get('#form-input-serviceNetworkCidr-field').click(); // just to scroll to it
  cy.get('#form-input-clusterNetworkCidr-field').should('be.visible');
  cy.get('#form-input-clusterNetworkHostPrefix-field').should('be.visible');
  cy.get('#form-input-serviceNetworkCidr-field').should('be.visible');

  if (clusterCidr) {
    cy.get('#form-input-clusterNetworkCidr-field').clear();
    cy.get('#form-input-clusterNetworkCidr-field').type(clusterCidr);
  }

  if (serviceCidr) {
    cy.get('#form-input-serviceNetworkCidr-field').clear();
    cy.get('#form-input-serviceNetworkCidr-field').type(serviceCidr);
  }

  if (networkPrefix) {
    cy.get('#form-input-clusterNetworkHostPrefix-field').clear();
    cy.get('#form-input-clusterNetworkHostPrefix-field').type(networkPrefix);
  }
};

export const getDomains = (cy: Cypress.cy) => {
  return new Cypress.Promise((resolve, reject) => {
    const readDomains = (response) => {
      resolve(response.body[0].provider);
    };

    makeApiCall(`/api/assisted-install/v1/domains`, 'GET', readDomains);
  });
};

export const enableRoute53 = (cy: Cypress.cy) => {
  cy.get('#form-input-useRedHatDnsService-field').click();
  getDomains(cy).then((provider) => {
    if (provider) {
      cy.get('#form-input-baseDnsDomain-field').contains(provider);
    }
  });
};

export const pressNext = (cy: Cypress.cy) => {
  cy.get('button[name="next"]', { timeout: PRESS_NEXT_TIMEOUT }).should('be.enabled');
  cy.get('button[name="next"]').click();
};
