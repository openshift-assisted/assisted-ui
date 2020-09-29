import {
  CLUSTER_NAME,
  DNS_DOMAIN_NAME,
  API_VIP,
  INGRESS_VIP,
  NUM_MASTERS,
  NUM_WORKERS,
  hostDetailSelector,
  openCluster,
  startClusterInstallation,
  waitForClusterInstallation,
  downloadFileWithChrome,
} from './shared';

import {
  HOST_REGISTRATION_TIMEOUT,
  HOST_DISCOVERY_TIMEOUT,
  VALIDATE_CHANGES_TIMEOUT,
} from './constants';

describe('Enter cluster details', () => {
  it('can open the cluster details', () => {
    openCluster(CLUSTER_NAME);
  });

  it('wait for the hosts table to be populated', () => {
    cy.get('table.hosts-table > tbody', { timeout: HOST_REGISTRATION_TIMEOUT }).should(($els) => {
      expect($els.length).to.be.eq(NUM_MASTERS + NUM_WORKERS);
    });
  });

  it('wait for the subnets options to be populated', () => {
    cy.get('#form-input-hostSubnet-field')
      .find('option', { timeout: HOST_DISCOVERY_TIMEOUT })
      .should(($els) => {
        expect($els.length).to.be.gt(0);
      })
      .and(($els) => {
        expect($els[0]).not.to.have.text('No subnets available');
      });
  });

  it('wait for all hosts to reach pending input state', () => {
    for (let i = 2; i <= NUM_MASTERS + NUM_WORKERS + 1; i++) {
      cy.contains(hostDetailSelector(i, 'Status'), 'Pending input', {
        timeout: HOST_DISCOVERY_TIMEOUT,
      });
    }
  });

  it('can set the base domain name', () => {
    // Cluster configuration - base domain
    cy.get('#form-input-baseDnsDomain-field').clear();
    cy.get('#form-input-baseDnsDomain-field').type(DNS_DOMAIN_NAME);
    cy.get('#form-input-baseDnsDomain-field').should('have.value', DNS_DOMAIN_NAME);
  });

  it('can select the first subnet CIDR', () => {
    cy.get('#form-input-hostSubnet-field')
      .find('option')
      .then(($els) => $els.get(1).setAttribute('selected', 'selected'))
      .parent()
      .trigger('change');
  });

  it('can set API VIP', () => {
    cy.get('#form-input-apiVip-field').clear();
    cy.get('#form-input-apiVip-field').type(API_VIP);
  });

  it('can set ingress VIP', () => {
    cy.get('#form-input-ingressVip-field').clear();
    cy.get('#form-input-ingressVip-field').type(INGRESS_VIP);
  });

  it('can save cluster details', () => {
    cy.get('button[name="save"]', { timeout: VALIDATE_CHANGES_TIMEOUT }).should(($elem) => {
      expect($elem).to.be.enabled;
    });
    cy.get('button[name="save"]').click();
  });
});

describe('Set roles', () => {
  it('set the masters', () => {
    cy.get('#form-input-name-field').click().type('{end}{home}');
    for (let i = 2; i < 2 + NUM_MASTERS; i++) {
      cy.get(hostDetailSelector(i, 'Role')).click().find('li#master').click();
    }
  });

  it('set the workers', () => {
    for (let i = 2 + NUM_MASTERS; i < 2 + NUM_MASTERS + NUM_WORKERS; i++) {
      cy.get(hostDetailSelector(i, 'Role')).click().find('li#worker').click();
    }
  });
});

describe('Run install', () => {
  it('start installation', () => {
    startClusterInstallation();
  });

  it('wait for cluster installation...', () => {
    waitForClusterInstallation();
  });
});

describe('Download kubeconfig', () => {
  it('download kubeconfig', () => {
    downloadFileWithChrome(
      'div.pf-l-grid__item > button.pf-c-button.pf-m-secondary',
      '~/Downloads/kubeconfig',
    );
    cy.exec('mv -f ~/Downloads/kubeconfig ~');
  });
});
