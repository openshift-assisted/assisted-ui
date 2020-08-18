import {
  CLUSTER_NAME,
  API_VIP,
  INGRESS_VIP,
  openCluster,
  saveClusterDetails,
  setClusterDnsDomain,
} from './shared';

// Start condition: Theese tests assume that the cluster is Ready to install.

const VIP_OUT_CIDR = '1.1.1.1';
const nicsTable = (row, label) =>
  `#expanded-content1 > .pf-c-table__expandable-row-content > 
                            .pf-l-grid > :nth-child(8) > 
                            .pf-c-table > tbody > tr > [data-label="${label}"]`;

function getMasterIp(cy) {
  cy.get('#expandable-toggle0').click();
  cy.get(nicsTable(1, 'IPv4 address')).then(($elem) => {
    cy.wrap($elem.text().split('/')[0]).as('masterIp');
  });
}

describe('Cluster Base DNS Domain validation', () => {
  before(function () {
    openCluster(CLUSTER_NAME);
  });

  it('set invalid DNS: IP instead of DNS', () => {
    setClusterDnsDomain(VIP_OUT_CIDR);
    cy.get('#form-input-baseDnsDomain-field-helper').contains(
      'is not valid DNS name. Example: basedomain.example.com',
    );
    cy.get('button[name="save"]').should('be.disabled');
  });

  it('set invalid DNS: empty DNS', () => {
    setClusterDnsDomain('', true);
    cy.get('#form-input-baseDnsDomain-field-helper').contains('The value is required.');
    cy.get('button[name="save"]').should('be.disabled');
  });

  it('set invalid DNS: single word', () => {
    setClusterDnsDomain('invalidDns');
    cy.get('#form-input-baseDnsDomain-field-helper').contains(
      'is not valid DNS name. Example: basedomain.example.com',
    );
    cy.get('button[name="save"]').should('be.disabled');
  });
});

describe('Cluster API VIP Validation', () => {
  beforeEach(function () {
    openCluster(CLUSTER_NAME);
  });

  it('set invalid IP: IP outside the CIDR', () => {
    cy.get('#form-input-apiVip-field').clear().type(VIP_OUT_CIDR);
    cy.get('#form-input-apiVip-field-helper').contains('IP Address is outside of selected subnet');
  });

  it('set invalid IP: same IP as master-0-0', () => {
    getMasterIp(cy);
    cy.get('@masterIp').then((ip) => {
      cy.get('#form-input-apiVip-field').clear().type(ip);
      saveClusterDetails(cy);
      cy.get('.pf-c-alert').contains('is already in use in cidr');
      cy.get('.pf-c-alert__action').click();
    });
    openCluster(CLUSTER_NAME);
    cy.get('#form-input-apiVip-field').should('have.value', API_VIP);
  });

  it('save is not allowed due to empty IP', () => {
    cy.get('#form-input-apiVip-field').clear();
    cy.get('button[name="save"]').should('be.disabled');
    cy.get('#form-input-apiVip-field-helper').contains('The value is required.');
  });

  it('check that correct VIP saved', () => {
    cy.get('#form-input-apiVip-field').clear();
    cy.get('#form-input-apiVip-field').type(API_VIP);
    cy.get('button[name="save"]').should('be.disabled');
    cy.get('#form-input-apiVip-field-helper').contains(
      'Virtual IP used to reach the OpenShift cluster API.',
    );
  });
});

describe('Cluster Ingress IP Validation', () => {
  beforeEach(function () {
    openCluster(CLUSTER_NAME);
  });

  it('set invalid IP', () => {
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
      cy.get('#form-input-ingressVip-field').clear().type(ip);
      saveClusterDetails(cy);
      cy.get('.pf-c-alert').contains('is already in use in cidr');
      cy.get('.pf-c-alert__action').click();
    });
    openCluster(CLUSTER_NAME);
    cy.get('#form-input-ingressVip-field').should('have.value', INGRESS_VIP);
  });

  it('save is not allowed due to empty IP', () => {
    cy.get('#form-input-ingressVip-field').clear();
    cy.get('button[name="save"]').should('be.disabled');
    cy.get('#form-input-ingressVip-field-helper').contains('The value is required.');
  });

  it('set same Ingress VIP as API VIP', () => {
    cy.get('#form-input-ingressVip-field').clear();
    cy.get('#form-input-ingressVip-field').type(API_VIP);
    cy.get('#form-input-ingressVip-field-helper').contains(
      'Ingress and API IP addresses can not be the same.',
    );
  });

  it('check that correct VIP saved', () => {
    cy.get('#form-input-ingressVip-field').clear();
    cy.get('#form-input-ingressVip-field').type(INGRESS_VIP);
    cy.get('button[name="save"]').should('be.disabled');
    cy.get('#form-input-ingressVip-field-helper').contains(
      'Virtual IP used for cluster ingress traffic.',
    );
  });
});
