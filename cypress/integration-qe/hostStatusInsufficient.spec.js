import { CLUSTER_NAME, openCluster } from './shared';

// @OCP-34205
//Following prerequisite steps needs to be done before running this test
// - only 1 VM running
// - VM CPU is set to 1 vcpu
const nodeName = 'master-0-0';

describe('Host status insufficient in Cluster Events', () => {
  before(function () {
    openCluster(CLUSTER_NAME);
  });

  it('Should click the View Cluster Events button', () => {
    cy.get('button[id=cluster-events-button]').click();
  });

  it('Should open the Cluster Events popup', () => {
    cy.get('#pf-modal-part-8');
  });

  it('Should contain insufficient host message', () => {
    cy.get('table[aria-label="Events table"]').contains(
      'Host does not pass minimum hardware requirements',
    );
  });

  it('Should close the Cluster Events popup', () => {
    cy.get('.pf-c-modal-box__footer > .pf-m-primary').click();
  });
});

describe(nodeName + ' status insufficient in Server Events', () => {
  before(function () {
    openCluster(CLUSTER_NAME);
  });

  it(nodeName + ' should have status Insufficient in the table', () => {
    cy.get('tbody').within(() => {
      cy.get('td').eq(1).contains(nodeName);
      cy.get('td').eq(3).contains('Insufficient');
    });
  });

  it(nodeName + ' should have status Insufficient in Host Events', () => {
    cy.get('tbody').within(() => {
      cy.get('td').eq(1).contains(nodeName);
      cy.get('td').eq(9).get('.pf-c-table__action > div').click();
    });
    cy.get('#button-view-host-events-master-0-0').click();
    cy.get('table[aria-label="Events table"]').contains(
      'Host does not pass minimum hardware requirements',
    );
  });
});
