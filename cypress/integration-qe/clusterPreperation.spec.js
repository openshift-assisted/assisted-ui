import {
  CLUSTER_NAME,
  DNS_DOMAIN_NAME,
  API_VIP,
  INGRESS_VIP,
  openCluster,
  waitForHostTablePopulation,
  waitForHostsSubnet,
  waitForPendingInputState,
  setClusterDnsDomain,
  setClusterSubnetCidr,
  setHostsRole,
  saveClusterDetails,
  waitForHostsToBeKnown,
} from './shared';

import { VALIDATE_CHANGES_TIMEOUT } from './constants';

// Start condition: Theese tests assume that:
// 1. new cluster created,
// 2. ISO already generated
// 3. Nodes are booted with generated ISO
// End: In the end of this test, all hosts will be Known, and cluster is ready to install.

describe('Enter cluster details', () => {
  it('open the cluster details', () => {
    openCluster(CLUSTER_NAME);
  });

  it('wait for the hosts table to be populated', () => {
    waitForHostTablePopulation(cy);
  });

  it('wait for the subnets options to be populated', () => {
    waitForHostsSubnet(cy);
  });

  it('wait for all hosts to reach pending input state', () => {
    waitForPendingInputState(cy);
  });

  it('set the base domain name', () => {
    setClusterDnsDomain(DNS_DOMAIN_NAME);
  });

  it('select the first subnet CIDR', () => {
    setClusterSubnetCidr(cy);
  });

  it('set API VIP', () => {
    cy.get('#form-input-apiVip-field').clear();
    cy.get('#form-input-apiVip-field').type(API_VIP);
  });

  it('set ingress VIP', () => {
    cy.get('#form-input-ingressVip-field').clear();
    cy.get('#form-input-ingressVip-field').type(INGRESS_VIP);
  });

  it('save cluster details', () => {
    saveClusterDetails(cy);
  });

  it('set masters and worker role', () => {
    setHostsRole();
  });

  it('check that cluster is ready to install', () => {
    waitForHostsToBeKnown();
    cy.get('button[name="install"]', { timeout: VALIDATE_CHANGES_TIMEOUT }).should(($elem) => {
      expect($elem).to.be.enabled;
    });
  });
});
