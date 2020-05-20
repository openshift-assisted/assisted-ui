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
    const colHeaderSelector = (label) => `[data-label="${label}"] > .pf-c-button`;
    cy.get('.pf-c-breadcrumb__list > :nth-child(2)').contains(testInfraClusterName);
    cy.get('#form-input-name-field').should('have.value', testInfraClusterName);
    cy.get('#form-input-baseDnsDomain-field').should('have.value', 'redhat');
    cy.get(':nth-child(2) > :nth-child(1) > h2').contains('Bare Metal Inventory');

    // Column headers
    cy.get('table.hosts-table > thead > tr > td').should('have.length', 2);
    cy.get('table.hosts-table > thead > tr > th').should('have.length', 8);
    cy.get(colHeaderSelector('ID')).contains('ID');
    cy.get(colHeaderSelector('Role')).contains('Role');
    cy.get(colHeaderSelector('Serial Number')).contains('Serial Number');
    cy.get(colHeaderSelector('Status')).contains('Status');
    cy.get(colHeaderSelector('Created At')).contains('Created At');
    cy.get(colHeaderSelector('CPU Cores')).contains('CPU Cores');
    cy.get(colHeaderSelector('Memory')).contains('Memory');
    cy.get(colHeaderSelector('Disk')).contains('Disk');
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
    const hostDetailSelector = (label) => `:nth-child(2) > :nth-child(1) > [data-label="${label}"]`;
    cy.get(hostDetailSelector('ID')).should('not.be.empty');
    cy.get(hostDetailSelector('Role')).contains('master'); // TODO(mlibra): verify dropdown, not static text
    cy.get(hostDetailSelector('Serial Number')).should('not.be.empty');
    cy.get(hostDetailSelector('Status')).contains('Known');
    cy.get(hostDetailSelector('Created At')).should('not.be.empty');
    cy.get(hostDetailSelector('CPU Cores')).contains('4');
    cy.get(hostDetailSelector('Memory')).contains(' GB'); // value can vary over time
    cy.get(hostDetailSelector('Disk')).contains(' GB');
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
    const disksTableHeader = (label) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-flex > :nth-child(6) > .pf-c-content > .pf-c-table > thead > tr > [data-label="${label}"]`;
    const disksTableCell = (row, label) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-flex > :nth-child(6) > .pf-c-content > .pf-c-table > tbody > :nth-child(${row}) > [data-label="${label}"]`;

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

    // Disks table format
    cy.get(sectionTitleSelector(5)).contains('1 Disks');
    cy.get(
      '#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-flex > :nth-child(6) > .pf-c-content > .pf-c-table > thead > tr > th',
    ).should('have.length', 7); // Disks table column count
    cy.get(disksTableHeader('Name')).contains('Name');
    cy.get(disksTableHeader('Size')).contains('Size');
    cy.get(disksTableHeader('Device type')).contains('Device type');

    // Disks values
    cy.get(disksTableCell(1, 'Name')).contains('vda');
    cy.get(disksTableCell(1, 'Size')).contains('20.00 GB');
    cy.get(disksTableCell(1, 'Device type')).contains('disk');
    // TODO(mlibra): add more once new retrieval of hwInfo is merged

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
