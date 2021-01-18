import {
  nicsTableCellSelector,
  saveClusterDetails,
  setClusterDnsDomain,
} from './shared/clusterConfiguration';
import { openCluster, clusterTableCellSelector } from './shared/clusterListPage';
import { API_VIP, CLUSTER_NAME, DNS_DOMAIN_NAME } from './shared/variables';

const VIP_OUT_CIDR = '1.1.1.1';

const getMasterIp = (cy: Cypress.cy) => {
  cy.get('#expandable-toggle0').click();
  cy.get(nicsTableCellSelector(1, 1, 'IPv4 address')).then(($elem) => {
    cy.wrap($elem.text().split('/')[0]).as('masterIp');
  });
  cy.get('#expandable-toggle0').click();

  cy.get('#expandable-toggle2').click();
  cy.get(nicsTableCellSelector(3, 1, 'IPv4 address')).then(($elem) => {
    cy.wrap($elem.text().split('/')[0]).as('master2Ip');
  });
  cy.get('#expandable-toggle2').click();
};

const beforeSuite = () => {
  cy.visit('');
  cy.get(clusterTableCellSelector(CLUSTER_NAME, 'Status')).contains('Ready');
  openCluster(cy, CLUSTER_NAME);
};

describe('Cluster Base DNS Domain validation', () => {
  before(beforeSuite);

  it('set invalid DNS: IP instead of DNS', () => {
    cy.get('button[name="save"]').should('be.disabled'); // no change yet
    cy.get('#form-input-baseDnsDomain-field-helper').contains(
      'All DNS records must be subdomains of this base and include the cluster name.', // no error yet
    );
    setClusterDnsDomain(cy, VIP_OUT_CIDR);
    cy.get('#form-input-baseDnsDomain-field-helper').contains(
      'is not valid DNS name. Example: basedomain.example.com',
    );
    cy.get('button[name="save"]').should('be.disabled');
  });

  it('set invalid DNS: empty DNS', () => {
    cy.get('button[name="save"]').should('be.disabled'); // no change yet
    setClusterDnsDomain(cy, 'added-by-test.' + DNS_DOMAIN_NAME); // still valid value, but changed
    saveClusterDetails(cy);
    cy.get('#form-input-baseDnsDomain-field').clear();
    cy.get('#form-input-baseDnsDomain-field-helper').contains('The value is required.');
    cy.get('button[name="save"]').should('be.disabled');
    setClusterDnsDomain(cy, DNS_DOMAIN_NAME); // clean-up
    saveClusterDetails(cy);
  });

  it('set invalid DNS: single word', () => {
    setClusterDnsDomain(cy, 'invalidDns');
    cy.get('#form-input-baseDnsDomain-field-helper').contains(
      'is not valid DNS name. Example: basedomain.example.com',
    );
    cy.get('button[name="save"]').should('be.disabled');
  });
});

describe('Cluster API VIP Validation', () => {
  before(beforeSuite);

  it('set invalid IP: IP outside the CIDR', () => {
    cy.get('#form-input-vipDhcpAllocation-field').uncheck();
    cy.get('#form-input-apiVip-field').clear().type(VIP_OUT_CIDR);
    cy.get('#form-input-apiVip-field-helper').contains('IP Address is outside of selected subnet');
  });

  it('set invalid IP: same IP as master-0-0', () => {
    cy.get('#form-input-vipDhcpAllocation-field').should('not.be.checked');
    getMasterIp(cy);
    cy.get('@masterIp').then((ip) => {
      cy.get('@master2Ip').then((ip2) => {
        cy.get('#form-input-apiVip-field').clear().type(ip);
        cy.get('#form-input-ingressVip-field').clear().type(ip2);
        saveClusterDetails(cy);
        cy.get('.pf-c-alert').contains('is already in use in cidr');
        cy.get('.pf-c-alert__action').click();
      });
    });
    openCluster(cy, CLUSTER_NAME);
    cy.get('#form-input-vipDhcpAllocation-field').should('be.checked'); // still on defaults since the form has not been saved
  });

  it('save is not allowed due to empty IP', () => {
    cy.get('#form-input-vipDhcpAllocation-field').uncheck();
    cy.get('#form-input-apiVip-field').clear();
    cy.get('button[name="save"]').should('be.disabled');
    cy.get('#form-input-apiVip-field-helper').contains('Required. Please provide an IP address');
    cy.get('#form-input-vipDhcpAllocation-field').check();
  });

  it('check that correct VIP saved', () => {
    cy.get('#form-input-vipDhcpAllocation-field').scrollIntoView();
    cy.get('#form-input-vipDhcpAllocation-field').uncheck();
    cy.get('#form-input-apiVip-field').clear().type(API_VIP);
    cy.get('button[name="save"]').should('be.disabled');
    cy.get('#form-input-apiVip-field-helper').contains(
      'Virtual IP used to reach the OpenShift cluster API.',
    );
    cy.get('#form-input-vipDhcpAllocation-field').check();
  });

  it('uses default VIPs again', () => {
    cy.get('#form-input-vipDhcpAllocation-field').check();
    saveClusterDetails(cy);
  });
});

describe('Cluster Ingress IP Validation', () => {
  before(beforeSuite);

  it('set invalid IP', () => {
    cy.get('#form-input-vipDhcpAllocation-field').uncheck();
    cy.get('#form-input-ingressVip-field').clear().type('192.168');
    cy.get('#form-input-ingressVip-field-helper').contains(
      'Value "192.168" is not valid IP address.',
    );
  });

  it('set invalid IP: IP outside the CIDR', () => {
    cy.get('#form-input-ingressVip-field').clear().type(VIP_OUT_CIDR);
    cy.get('#form-input-ingressVip-field-helper').contains(
      'IP Address is outside of selected subnet',
    );
  });

  it('set invalid IP: same IP as master-0-0', () => {
    getMasterIp(cy);
    cy.get('@masterIp').then((ip) => {
      cy.get('@master2Ip').then((ip2) => {
        cy.get('#form-input-apiVip-field').clear().type(ip);
        cy.get('#form-input-ingressVip-field').clear().type(ip2);
        saveClusterDetails(cy);
        cy.get('.pf-c-alert').contains('is already in use in cidr');
        cy.get('.pf-c-alert__action').click();
      });
    });
    openCluster(cy, CLUSTER_NAME);
    cy.get('#form-input-vipDhcpAllocation-field').should('be.checked'); // still on auto-allocation
  });

  it('set same Ingress VIP as API VIP', () => {
    cy.get('#form-input-vipDhcpAllocation-field').scrollIntoView();
    cy.get('#form-input-vipDhcpAllocation-field').uncheck();
    cy.get('#form-input-ingressVip-field').clear().type(API_VIP);
    cy.get('#form-input-apiVip-field').clear().type(API_VIP);
    cy.get('#form-input-ingressVip-field-helper').contains(
      'The Ingress and API Virtual IP addresses cannot be the same.',
    );
  });
});
