import {
  createCluster,
  getClusterNameLinkSelector,
  deleteCluster,
  pasteText,
  PULL_SECRET,
  API_ENDPOINT,
} from './shared';

const clusterNameMatcher = (clusterName) => {
  const matcher = (clusterJson) => {
    return clusterJson.name === clusterName;
  };
  return matcher;
};

describe('HLD Create Cluster Functionality', () => {
  it('create a test cluster via the GUI', () => {
    createCluster('test-cluster-1', PULL_SECRET);
  });

  it('list the cluster in the clusters page', () => {
    cy.visit('');
    cy.get(getClusterNameLinkSelector('test-cluster-1')).should('be.visible');
  });

  it('list the cluster via the API', () => {
    cy.request(API_ENDPOINT + '/api/assisted-install/v1/clusters').then((response) => {
      const clusters = response.body;
      expect(clusters.some(clusterNameMatcher('test-cluster-1'))).to.be.true;
    });
  });
});

describe('Create and Delete a Second Cluster', () => {
  it('create a test cluster via the GUI', () => {
    createCluster('test-cluster-2', PULL_SECRET);
  });

  it('list the cluster in the clusters page', () => {
    cy.visit('');
    cy.get(getClusterNameLinkSelector('test-cluster-1')).should('be.visible');
    cy.get(getClusterNameLinkSelector('test-cluster-2')).should('be.visible');
  });

  it('list the 2 clusters via the API', () => {
    cy.request(API_ENDPOINT + '/api/assisted-install/v1/clusters').then((response) => {
      const clusters = response.body;
      expect(clusters.some(clusterNameMatcher('test-cluster-1'))).to.be.true;
      expect(clusters.some(clusterNameMatcher('test-cluster-2'))).to.be.true;
    });
  });

  it('delete the first test cluster via the UI', () => {
    deleteCluster('test-cluster-1');
    cy.get(getClusterNameLinkSelector('test-cluster-1')).should('not.exist');
  });

  it('delete the second test cluster via the UI', () => {
    deleteCluster('test-cluster-2');
    cy.get(getClusterNameLinkSelector('test-cluster-2')).should('not.exist');
  });

  // it('delete a cluster via the API', () => {
  //   openCluster('test-cluster-2');
  //   cy.location('href').should((clusterUrl) => {
  //     expect(clusterUrl).to.have.string('/clusters/');
  //     let id = clusterUrl.split('/clusters/')[1];
  //     cy.request('DELETE', API_ENDPOINT + '/api/assisted-install/v1/clusters/' + id).then((response) => {
  //       expect(response.status).to.be.eq(200);
  //     });
  //   });
  // });
});

describe('Unique Cluster Name', () => {
  it("doesn't let the user create 2 clusters with the same name", () => {
    createCluster('cluster-unique-name', PULL_SECRET);
    cy.visit('');
    cy.get('#button-create-new-cluster').click();
    cy.get('#form-input-name-field').clear();
    cy.get('#form-input-name-field').type('cluster-unique-name');
    cy.get('#form-input-pullSecret-field').clear();
    pasteText(cy, '#form-input-pullSecret-field', PULL_SECRET);
    cy.get('form').submit();
    // there should be an error
    cy.get('#form-input-name-field-helper').should('be.visible');
    cy.get('button.pf-m-secondary').click();
    cy.get('#form-input-name-field-helper').should('not.be.visible');
  });

  it('cleanup - delete cluster-unique-name', () => {
    deleteCluster('cluster-unique-name');
  });
});
