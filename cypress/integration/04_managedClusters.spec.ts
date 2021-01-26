import {
  assertClusterPresence,
  createClusterFillForm,
  cancelCreateCluster,
  createCluster,
  clusterTableCellSelector,
  clusterTableCellSelectorByRowIndex,
  deleteClusterByName,
  getClusterNameLinkSelector,
} from './shared/clusterListPage';
import { withValueOf } from './shared/common';
import { TEST_INFRA_CLUSTER_NAME } from './shared/testInfraCluster';
import { PULL_SECRET } from './shared/variables';

const clustersTableHeaders = ['Name', 'Base domain', 'Version', 'Status', 'Hosts', 'Created at'];

describe('Managed Clusters list', () => {
  const clusterName = 'test-dummy-cluster';
  const clusterColHeaderSelector = (label: string) => `th[data-label="${label}"] > button`;

  beforeEach(() => {
    assertClusterPresence(cy, TEST_INFRA_CLUSTER_NAME);
    cy.visit('/clusters');

    cy.get('#clusters-list-toolbar > :nth-child(2) > :nth-child(2) > .pf-c-button').should(
      'not.exist',
    ); // Clear all chips link; Filters are persistent
    cy.get(getClusterNameLinkSelector(clusterName)).should('not.exist');
    cy.get(getClusterNameLinkSelector('cluster-aa-0')).should('not.exist');
    cy.get(getClusterNameLinkSelector('cluster-bb-0')).should('not.exist');
  });

  it('can render', () => {
    cy.get('h1').contains('Assisted Bare Metal Clusters');
  });

  it('has test-infra-cluster with visible columns', () => {
    clustersTableHeaders.forEach((header) =>
      cy.get(clusterColHeaderSelector(header)).contains(header),
    );
  });

  it('can create and delete dummy cluster', () => {
    // create and cancel the dummy cluster
    createClusterFillForm(cy, clusterName, PULL_SECRET);
    cancelCreateCluster(cy);

    // do not allow two clusters of the same name
    createClusterFillForm(cy, TEST_INFRA_CLUSTER_NAME, PULL_SECRET);
    cy.get('button[name="save"]').click();
    cy.contains('#form-input-name-field-helper', 'is already taken');
    cancelCreateCluster(cy);

    // create the dummy cluster
    createCluster(cy, clusterName, PULL_SECRET);

    // Close
    cy.get('#cluster-configuration-back-to-all-clusters').click();

    // Managed Clusters list
    // cy.get('[data-label="Name"] > a').should('have.length', 2);
    cy.get(clusterTableCellSelector(clusterName, 'Name')).contains(clusterName);
    cy.get(clusterTableCellSelector(TEST_INFRA_CLUSTER_NAME, 'Name')).contains(
      TEST_INFRA_CLUSTER_NAME,
    ); // other cells of the test-infra-cluster are tested within assertTestClusterPresence()
    cy.get(clusterTableCellSelector(clusterName, 'Base domain')).contains('-');
    cy.get(clusterTableCellSelector(clusterName, 'Version')).contains('4.6');
    cy.get(clusterTableCellSelector(clusterName, 'Status')).contains('Draft'); // insufficient ~ Draft
    cy.get(clusterTableCellSelector(clusterName, 'Hosts')).contains(0);

    // sorting
    withValueOf(cy, clusterTableCellSelectorByRowIndex(1, 'Name'), (value1) => {
      withValueOf(cy, clusterTableCellSelectorByRowIndex(2, 'Name'), (value2) => {
        expect(value1.localeCompare(value2) < 0);
      });
    });
    cy.get(clusterColHeaderSelector('Name')).click();
    withValueOf(cy, clusterTableCellSelectorByRowIndex(1, 'Name'), (value1) => {
      withValueOf(cy, clusterTableCellSelectorByRowIndex(2, 'Name'), (value2) => {
        expect(value1.localeCompare(value2) > 0);
      });
    });
    cy.get(clusterColHeaderSelector('Name')).click();
    withValueOf(cy, clusterTableCellSelectorByRowIndex(1, 'Name'), (value1) => {
      withValueOf(cy, clusterTableCellSelectorByRowIndex(2, 'Name'), (value2) => {
        expect(value1.localeCompare(value2) < 0);
      });
    });

    // does it fail?
    clustersTableHeaders.forEach((header) => {
      cy.get(clusterColHeaderSelector(header)).click();
      cy.get(clusterColHeaderSelector(header)).click();
    });
    cy.get(clusterColHeaderSelector('Name')).click(); // sort by name again

    // Delete
    deleteClusterByName(cy, clusterName);

    // we are back to inital state with just a single cluster
    assertClusterPresence(cy, TEST_INFRA_CLUSTER_NAME);
  });

  it('can filter clusters', () => {
    // create
    createCluster(cy, 'cluster-aa-0', PULL_SECRET);
    createCluster(cy, 'cluster-bb-0', PULL_SECRET);
    cy.get('#cluster-configuration-back-to-all-clusters').click();

    // all visible
    cy.get(getClusterNameLinkSelector(TEST_INFRA_CLUSTER_NAME));
    cy.get(getClusterNameLinkSelector('cluster-aa-0'));
    cy.get(getClusterNameLinkSelector('cluster-bb-0'));

    // search name
    cy.get('#search-string').type('NONSENS');
    cy.get(getClusterNameLinkSelector(TEST_INFRA_CLUSTER_NAME)).should('not.exist');
    cy.get(getClusterNameLinkSelector('cluster-aa-0')).should('not.exist');
    cy.get(getClusterNameLinkSelector('cluster-bb-0')).should('not.exist');

    // clear search name
    cy.get('#search-string').type('{selectall}{backspace}');
    cy.get(getClusterNameLinkSelector(TEST_INFRA_CLUSTER_NAME));
    cy.get(getClusterNameLinkSelector('cluster-aa-0'));
    cy.get(getClusterNameLinkSelector('cluster-bb-0'));

    cy.get('#search-string').type('aa');
    cy.get(getClusterNameLinkSelector(TEST_INFRA_CLUSTER_NAME)).should('not.exist');
    cy.get(getClusterNameLinkSelector('cluster-bb-0')).should('not.exist');
    cy.get(getClusterNameLinkSelector('cluster-aa-0')); // exists

    cy.get('#search-string').type('{selectall}{backspace}');
    cy.get(getClusterNameLinkSelector(TEST_INFRA_CLUSTER_NAME));

    // switch status
    cy.get('#cluster-list-filter-status').click();
    cy.get('#cluster-list-filter-status-Draft').click();
    cy.contains('.pf-c-check__label', 'Draft');
    cy.get(getClusterNameLinkSelector(TEST_INFRA_CLUSTER_NAME)).should('not.exist');
    cy.get(getClusterNameLinkSelector('cluster-aa-0'));
    cy.get(getClusterNameLinkSelector('cluster-bb-0'));

    cy.get('#cluster-list-filter-status-Ready').click();
    cy.get(getClusterNameLinkSelector(TEST_INFRA_CLUSTER_NAME));
    cy.get(getClusterNameLinkSelector('cluster-aa-0'));
    cy.get(getClusterNameLinkSelector('cluster-bb-0'));

    cy.get('#cluster-list-filter-status-Draft').click();
    cy.get(getClusterNameLinkSelector(TEST_INFRA_CLUSTER_NAME));
    cy.get(getClusterNameLinkSelector('cluster-aa-0')).should('not.exist');
    cy.get(getClusterNameLinkSelector('cluster-bb-0')).should('not.exist');

    // clear all filters
    cy.get('#cluster-list-filter-status').click(); // close Status dropdown
    cy.get('#clusters-list-toolbar > :nth-child(2) > :nth-child(2) > .pf-c-button').click();
    cy.get(getClusterNameLinkSelector(TEST_INFRA_CLUSTER_NAME));
    cy.get(getClusterNameLinkSelector('cluster-aa-0'));
    cy.get(getClusterNameLinkSelector('cluster-bb-0'));

    // Delete
    deleteClusterByName(cy, 'cluster-aa-0');
    deleteClusterByName(cy, 'cluster-bb-0');

    // we are back to inital state with just a single cluster
    assertClusterPresence(cy, TEST_INFRA_CLUSTER_NAME); // fail fast here to verify that just the dummy cluster is deleted
  });
});
