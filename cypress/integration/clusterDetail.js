import {
  createDummyCluster,
  deleteDummyCluster,
  assertSingleClusterOnly,
  testInfraClusterName,
  testInfraClusterHostsCount,
  withValueOf,
} from './shared';

describe('Cluster Detail', () => {
  beforeEach(() => {
    assertSingleClusterOnly(cy);
    cy.visit('/clusters');
    cy.get('[data-label="Name"] > a').click();
  });

  it('can render', () => {
    cy.get('.pf-c-breadcrumb__list > :nth-child(2)').contains(testInfraClusterName);
    cy.get('#form-input-name-field').should('have.value', testInfraClusterName);
    cy.get('#form-input-baseDnsDomain-field').should('have.value', 'redhat');
    cy.get(':nth-child(2) > :nth-child(1) > h2').contains('Bare Metal Inventory');

    // Column headers
    cy.get('table.hosts-table > thead > tr > td').should('have.length', 2);
    cy.get('table.hosts-table > thead > tr > th').should('have.length', 8);
    cy.get('[data-label="ID"] > .pf-c-button').contains('ID');
    cy.get('[data-label="Role"] > .pf-c-button').contains('Role');
    cy.get('[data-label="Serial Number"] > .pf-c-button').contains('Serial Number');
    cy.get('[data-label="Status"] > .pf-c-button').contains('Status');
    cy.get('[data-label="Created At"] > .pf-c-button').contains('Created At');
    cy.get('[data-label="CPU Cores"] > .pf-c-button').contains('CPU Cores');
    cy.get('[data-label="Memory"] > .pf-c-button').contains('Memory');
    cy.get('[data-label="Disk"] > .pf-c-button').contains('Disk');
  });

  // existing cluster
  it('has all hosts', () => {
    cy.get('table.hosts-table > tbody').should('have.length', testInfraClusterHostsCount);
    cy.get('table.hosts-table > tbody > tr.pf-c-table__expandable-row:hidden').should(
      'have.length',
      testInfraClusterHostsCount,
    );
  });

  it('has correct row-details for a host', () => {
    cy.get(':nth-child(2) > :nth-child(1) > [data-label="ID"]').should('not.be.empty');
    cy.get(':nth-child(2) > :nth-child(1) > [data-label="Role"]').contains('master'); // TODO(mlibra): verify dropdown, not static text
    cy.get(':nth-child(2) > :nth-child(1) > [data-label="Serial Number"]').should('not.be.empty');
    cy.get(':nth-child(2) > :nth-child(1) > [data-label="Status"]').contains('Known');
    cy.get(':nth-child(2) > :nth-child(1) > [data-label="Created At"]').should('not.be.empty');
    cy.get(':nth-child(2) > :nth-child(1) > [data-label="CPU Cores"]').contains('4');
    cy.get(':nth-child(2) > :nth-child(1) > [data-label="Memory"]').contains(' GB'); // value can vary over time
    cy.get(':nth-child(2) > :nth-child(1) > [data-label="Disk"]').contains(' GB');
  });

  it('has correct expandable-details for a host', () => {
    const sectionTitleSelector = (index) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-flex > :nth-child(${index}) > .pf-c-content > h3`;
    const hostDetailsSelector = (column, row) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-flex > :nth-child(${column}) > .pf-c-content > :nth-child(${row})`;
    const nicsTableHeader = (label) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-flex > :nth-child(8) > .pf-c-content > .pf-c-table > thead > tr > [data-label="${label}"]`;
    const nicsTableCell = (row, label) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-flex > :nth-child(8) > .pf-c-content > .pf-c-table > tbody > :nth-child(${row}) > [data-label="${label}"]`;

    // Expand detail
    cy.get('#expandable-toggle0').should('not.have.class', 'pf-m-expanded');
    cy.get('#expandable-toggle0').click();
    cy.get('#expandable-toggle0').should('have.class', 'pf-m-expanded');

    // Host Details
    cy.get(sectionTitleSelector(1)).contains('Host Details');

    cy.get(hostDetailsSelector(2, 1)).contains('CPU architecture');
    cy.get(hostDetailsSelector(2, 2)).contains('x86_64');
    cy.get(hostDetailsSelector(3, 1)).contains('Memory capacity');
    cy.get(hostDetailsSelector(3, 2)).contains('16.19 GB'); // Let's risk and see if we can use this constant long-term
    cy.get(hostDetailsSelector(4, 1)).contains('Sockets');
    cy.get(hostDetailsSelector(4, 2)).contains('4');
    cy.get(hostDetailsSelector(2, 3)).contains('Model name');
    cy.get(hostDetailsSelector(2, 4)).should('not.be.empty'); // can vary
    cy.get(hostDetailsSelector(3, 3)).contains('CPU clock speed');
    cy.get(hostDetailsSelector(3, 4)).contains('MHz');
    cy.get(hostDetailsSelector(3, 4)).contains('4x 0 MHz').should('have.length', 0);
    cy.get(hostDetailsSelector(4, 3)).contains('Threads per core');
    cy.get(hostDetailsSelector(4, 4)).contains('1');

    // Disks
    // cy.get(sectionTitleSelector(5)).contains('3 Disks'); // TODO(mlibra) uncomment after PR 119
    // TODO(mlibra) verify values after PR 119

    // Nics table format
    cy.get(sectionTitleSelector(7)).contains('2 NICs');
    cy.get(
      '#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-flex > :nth-child(8) > .pf-c-content > .pf-c-table > thead > tr > th',
    ).should('have.length', 4); // NICs table column count
    cy.get(nicsTableHeader('Name')).contains('Name');
    cy.get(nicsTableHeader('MAC address')).contains('MAC address');
    cy.get(nicsTableHeader('IP address')).contains('IP address');
    cy.get(nicsTableHeader('State')).contains('State');

    // NICs values
    cy.get(nicsTableCell(1, 'Name')).contains('docker0');
    cy.get(nicsTableCell(2, 'Name')).contains('eth0');
    cy.get(nicsTableCell(1, 'MAC address')).should('not.be.empty');
    cy.get(nicsTableCell(2, 'MAC address')).should('not.be.empty');
    cy.get(nicsTableCell(1, 'IP address')).contains('/16');
    cy.get(nicsTableCell(1, 'IP address')).contains('undefined').should('have.length', 0);
    cy.get(nicsTableCell(2, 'IP address')).contains('/24');
    cy.get(nicsTableCell(1, 'State')).contains('BROADCAST');

    // Collapse
    cy.get('#expandable-toggle0').should('have.class', 'pf-m-expanded');
    cy.get('#expandable-toggle0').click();
    cy.get('#expandable-toggle0').should('not.have.class', 'pf-m-expanded');
  });

  it('can be sorted', () => {
    const serialNumberSelector = (row) =>
      `:nth-child(${row}) > :nth-child(1) > [data-label="Serial Number"]`;

    cy.get('.pf-m-selected > .pf-c-button').contains('Role'); // default sorting by Role
    cy.get('.pf-m-selected > .pf-c-button').click();
    cy.get('.pf-m-selected > .pf-c-button').click(); // Did it fall?

    cy.get('[data-label="Serial Number"] > .pf-c-button').click(); // ASC sort by Serial Number

    withValueOf(cy, serialNumberSelector(2), (val1) => {
      withValueOf(cy, serialNumberSelector(3), (val2) => {
        expect(val1.localeCompare(val2)).to.be.lessThan(0);
      });
    });

    cy.get('[data-label="Serial Number"] > .pf-c-button').click(); // DESC sort by Serial Number
    withValueOf(cy, serialNumberSelector(2), (val1) => {
      withValueOf(cy, serialNumberSelector(3), (val2) => {
        expect(val1.localeCompare(val2)).to.be.greaterThan(0);
      });
    });

    cy.get('[data-label="Serial Number"] > .pf-c-button').click(); // ASC sort by Serial Number
    withValueOf(cy, serialNumberSelector(2), (val1) => {
      withValueOf(cy, serialNumberSelector(3), (val2) => {
        expect(val1.localeCompare(val2)).to.be.lessThan(0);
      });
    });
  });

  it('renders empty cluster', () => {
    const dummyClusterName = 'empty-cluster';
    cy.visit('/clusters');
    createDummyCluster(cy, dummyClusterName);
    cy.get(':nth-child(1) > [data-label="Name"] > a').click();
    cy.get('.pf-c-breadcrumb__list > :nth-child(2)').contains(dummyClusterName);
    cy.get('#form-input-name-field').should('have.value', dummyClusterName);
    cy.get('.pf-c-title').contains('Waiting for hosts...'); // empty state

    cy.get(':nth-child(3) > .pf-l-toolbar__item > .pf-c-button').click(); // Close button

    deleteDummyCluster(cy, '#pf-toggle-id-18');
  });
});
