import {
  createDummyCluster,
  deleteDummyCluster,
  testInfraClusterName,
  testInfraClusterHostsCount,
  withValueOf,
  visitTestCluster,
} from './shared';

const DISCOVERING_TIMEOUT = 2 * 60 * 1000; // 2 mins

describe('Cluster Detail', () => {
  const hostDetailSelector = (row, label) =>
    `:nth-child(${row}) > :nth-child(1) > [data-label="${label}"]`;
  const hostsTableHeaderSelector = (label) => `[data-label="${label}"] > .pf-c-table__button`;

  const hostTableColHeaders = [
    'Hostname',
    'Role',
    'Status',
    'Discovered At',
    'CPU Cores',
    'Memory',
    'Disk',
  ];
  
  beforeEach(() => {
    visitTestCluster(cy);
  });

  xit('can render', () => {
    const colHeaderSelector = (label) =>
      `[data-label="${label}"] > .pf-c-table__button > .pf-c-table__button-content > .pf-c-table__text`;

    cy.get('.pf-c-breadcrumb__list > :nth-child(2)').contains(testInfraClusterName);
    cy.get('#form-input-name-field').should('have.value', testInfraClusterName);
    cy.get('#form-input-baseDnsDomain-field').should('have.value', 'redhat.com');
    cy.get(':nth-child(2) > :nth-child(1) > h2').contains('Bare Metal Inventory');

    // Column headers
    cy.get('table.hosts-table > thead > tr > td').should('have.length', 2);
    cy.get('table.hosts-table > thead > tr > th').should('have.length', 7);
    hostTableColHeaders.forEach((header) => cy.get(colHeaderSelector(header)).contains(header));
  });

  // existing cluster
  xit('has all hosts', () => {
    cy.get('table.hosts-table > tbody').should('have.length', testInfraClusterHostsCount);
    cy.get('table.hosts-table > tbody > tr.pf-c-table__expandable-row:hidden').should(
      'have.length',
      testInfraClusterHostsCount,
    );
  });

  xit('has correct row-details for a host', () => {
    cy.get(hostDetailSelector(2, 'Hostname')).contains('test-infra-cluster-master-0');
    cy.get(hostDetailSelector(2, 'Role')).contains('master');
    cy.get(hostDetailSelector(2, 'Status')).contains('Known');
    cy.get(hostDetailSelector(2, 'Discovered At')).should('not.be.empty');
    cy.get(hostDetailSelector(2, 'CPU Cores')).contains('4');
    cy.get(hostDetailSelector(2, 'Memory')).contains('16.59 GB'); // value can vary over time
    cy.get(hostDetailSelector(2, 'Disk')).contains('20.00 GB');
  });

  // TODO(mlibra): Read particular details from fixtures
  xit('has correct expandable-details for a host', () => {
    const sectionTitleSelector = (index) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-grid > :nth-child(${index}) > .pf-c-content > h3`;
    const hostDetailsSelector = (column, row) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-grid > :nth-child(${column}) > .pf-c-content > .detail-list > :nth-child(${row})`;
    const nicsTableHeader = (label) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-grid > :nth-child(8) > .pf-c-table > thead > tr > [data-label="${label}"]`;
    const nicsTableCell = (row, label) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-grid > :nth-child(8) > .pf-c-table > tbody > tr > [data-label="${label}"]`;
    const disksTableHeader = (label) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-grid > :nth-child(6) > .pf-c-table > thead > tr > [data-label="${label}"]`;
    const disksTableCell = (row, label) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-grid > :nth-child(6) > .pf-c-table > tbody > tr > [data-label="${label}"]`;

    // Expand detail
    cy.get('#expandable-toggle0').should('not.have.class', 'pf-m-expanded');
    cy.get('#expandable-toggle0').click();
    cy.get('#expandable-toggle0').should('have.class', 'pf-m-expanded');

    // Host Details
    cy.log('Host Details');
    cy.get(sectionTitleSelector(1)).contains('Host Details');
    cy.get(hostDetailsSelector(2, 1)).contains('Manufacturer');
    cy.get(hostDetailsSelector(2, 2)).contains('Red Hat');
    cy.get(hostDetailsSelector(2, 3)).contains('Product');
    cy.get(hostDetailsSelector(2, 4)).contains('KVM');
    cy.get(hostDetailsSelector(2, 5)).contains('Serial number');
    cy.get(hostDetailsSelector(2, 6)).contains('-');

    cy.get(hostDetailsSelector(3, 1)).contains('CPU architecture');
    cy.get(hostDetailsSelector(3, 2)).contains('x86_64');
    cy.get(hostDetailsSelector(3, 3)).contains('CPU model name');
    cy.get(hostDetailsSelector(3, 4)).should('not.be.empty'); // can vary
    cy.get(hostDetailsSelector(3, 5)).contains('CPU clock speed');
    cy.get(hostDetailsSelector(3, 6)).contains('x'); // value can vary
    cy.get(hostDetailsSelector(3, 6)).contains('MHz');

    cy.get(hostDetailsSelector(4, 1)).contains('Memory capacity');
    cy.log("Let's see how test host memory capacity vary");
    cy.get(hostDetailsSelector(4, 2)).contains('16.59 GB');
    cy.get(hostDetailsSelector(4, 3)).contains('BMC address');
    cy.get(hostDetailsSelector(4, 4)).contains('0.0.0.0, ::/0');
    cy.get(hostDetailsSelector(4, 5)).contains('Boot mode');
    cy.get(hostDetailsSelector(4, 6)).contains('bios');

    // Disks table format
    cy.log('Host disks');
    cy.get(sectionTitleSelector(5)).contains('1 Disks');
    cy.get('#expanded-content1 > div > div > div:nth-child(6) > table > thead > tr > th').should(
      'have.length',
      6,
    ); // Disks table column count
    cy.get(disksTableHeader('Name')).contains('Name');
    cy.get(disksTableHeader('Drive type')).contains('Drive type');
    cy.get(disksTableHeader('Size')).contains('Size');
    cy.get(disksTableHeader('Serial')).contains('Serial');
    cy.get(disksTableHeader('Model')).contains('Model');
    cy.get(disksTableHeader('WWN')).contains('WWN');

    // Disks values
    cy.get(disksTableCell(1, 'Name')).contains('vda');
    cy.get(disksTableCell(1, 'Drive type')).contains('HDD');
    cy.get(disksTableCell(1, 'Size')).contains('20.00 GB');
    cy.get(disksTableCell(1, 'Serial')).contains('unknown'); // unknown in KVM-based environment
    cy.get(disksTableCell(1, 'Model')).contains('unknown');
    cy.get(disksTableCell(1, 'WWN')).contains('unknown');

    // Nics table format
    cy.log('NICs');
    cy.get(sectionTitleSelector(7)).contains('1 NICs');
    cy.get('#expanded-content1 > div > div > div:nth-child(8) > table > thead > tr > th').should(
      'have.length',
      5,
    ); // NICs table column count
    cy.get(nicsTableHeader('Name')).contains('Name');
    cy.get(nicsTableHeader('MAC address')).contains('MAC address');
    cy.get(nicsTableHeader('IPv4 address')).contains('IPv4 address');
    cy.get(nicsTableHeader('IPv6 address')).contains('IPv6 address');
    cy.get(nicsTableHeader('Speed')).contains('Speed');

    // NICs values
    cy.get(nicsTableCell(1, 'Name')).contains('eth0');
    cy.get(nicsTableCell(1, 'MAC address')).should('not.be.empty');
    cy.get(nicsTableCell(1, 'MAC address')).contains(':'); // value can vary
    cy.log('Is IP address stable?');
    cy.get(nicsTableCell(1, 'IPv4 address')).contains('192.168.126.10/24');
    cy.get(nicsTableCell(1, 'IPv6 address')).contains('/64');
    cy.get(nicsTableCell(1, 'Speed')).contains('Mbps'); // TODO(mlibra): value is about to be changed

    // Collapse
    cy.get('#expandable-toggle0').should('have.class', 'pf-m-expanded');
    cy.get('#expandable-toggle0').click();
    cy.get('#expandable-toggle0').should('not.have.class', 'pf-m-expanded');
  });

  xit('can be sorted', () => {
    const hostnameSelector = (row) =>
      `:nth-child(${row}) > :nth-child(1) > [data-label="Hostname"]`;
    const hostnameHeaderSelector = hostsTableHeaderSelector('Hostname');
    const actualSorterSelector = '.pf-m-selected > .pf-c-table__button';

    cy.get(actualSorterSelector).contains('Hostname'); // default sorting by Hostname
    cy.get(actualSorterSelector).click();
    cy.get(actualSorterSelector).click(); // Did it fall?
    hostTableColHeaders.forEach((header) => {
      cy.get(hostsTableHeaderSelector(header)).click();
      cy.get(hostsTableHeaderSelector('Role')).click();
    });

    cy.log('ASC sort by hostname');
    cy.get(hostnameHeaderSelector).click();
    withValueOf(cy, hostnameSelector(2), (val1) => {
      withValueOf(cy, hostnameSelector(3), (val2) => {
        expect(val1.localeCompare(val2)).to.be.lessThan(0);
      });
    });

    cy.log('DESC sort by hostname');
    cy.get(hostnameHeaderSelector).click();
    withValueOf(cy, hostnameSelector(2), (val1) => {
      withValueOf(cy, hostnameSelector(3), (val2) => {
        expect(val1.localeCompare(val2)).to.be.greaterThan(0);
      });
    });
  });

  xit('renders empty cluster', () => {
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

  xit("changes host's role", () => {
    const clusterListStatusSelector = ':nth-child(1) > [data-label="Status"]';

    cy.get(hostsTableHeaderSelector('Serial Number')).click(); // ASC sort by Serial Number
    cy.get(hostDetailSelector(3, 'Role')).contains('master'); // 2nd host in the list
    cy.get(hostDetailSelector(3, 'Role')).click();
    cy.get('#worker > .pf-c-dropdown__menu-item').click();
    cy.get(hostDetailSelector(3, 'Role')).contains('worker');

    // check cluster validation
    cy.visit('/clusters');
    cy.get(clusterListStatusSelector).contains('insufficient');
    cy.get('[data-label="Name"] > a').click();

    // revert change
    cy.get(hostsTableHeaderSelector('Serial Number')).click(); // ASC sort by Serial Number
    cy.get(hostDetailSelector(3, 'Role')).contains('worker'); // 2nd host in the list
    cy.get(hostDetailSelector(3, 'Role')).click();
    cy.get('#master > .pf-c-dropdown__menu-item').click();
    cy.get(hostDetailSelector(3, 'Role')).contains('master');

    // check cluster validation
    cy.visit('/clusters');
    cy.get(clusterListStatusSelector).contains('ready');
  });

  xit('disables and enables host in a cluster', () => {
    const kebabMenuSelector =
      ':nth-child(2) > :nth-child(1) > .pf-c-table__action button.pf-c-dropdown__toggle';
    cy.get(kebabMenuSelector).click(); // first host kebab menu
    cy.get('.pf-c-dropdown__menu-item').contains('Disable in cluster');
    cy.get('.pf-c-dropdown__menu-item').click();
    cy.get(hostDetailSelector(2, 'Status')).contains('Disabled');

    cy.get(kebabMenuSelector).click(); // first host kebab menu
    cy.get('.pf-c-dropdown__menu-item').contains('Enable in cluster');
    cy.get('.pf-c-dropdown__menu-item').click();
    cy.get(hostDetailSelector(2, 'Status')).contains('Discovering');
    cy.get(hostDetailSelector(2, 'Status')).contains('Known', { timeout: DISCOVERING_TIMEOUT });
  });

  xit('downloads ISO', () => {
    const proxyURLSelector = '#form-input-proxyURL-field';
    const proxyURLSelectorHelper = '#form-input-proxyURL-field-helper';
    const sshPublicKeySelector = ':nth-child(3) > #form-input-sshPublicKey-field';

    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(2) > .pf-c-button').click(); // Download ISO button
    cy.get('.pf-c-modal-box'); // modal visible
    cy.get('.pf-c-title').contains('Download discovery ISO');
    cy.get('.pf-c-modal-box__footer > .pf-m-link').click(); // cancel
    cy.get('.pf-c-modal-box').should('not.be.visible'); // modal closed

    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(2) > .pf-c-button').click(); // Download ISO button
    cy.get('.pf-c-title').contains('Download discovery ISO');
    cy.get(proxyURLSelector).type('{selectall}{backspace}foobar');
    cy.get(sshPublicKeySelector).focus();
    cy.get(proxyURLSelectorHelper).contains('Provide a valid URL.'); // validation error
    cy.get(proxyURLSelector).type('{selectall}{backspace}http://foo.com/bar');
    cy.get(sshPublicKeySelector).focus();
    cy.get(proxyURLSelectorHelper).contains('HTTP proxy URL'); // correct

    cy.get(sshPublicKeySelector).type('ssh-rsa AAAAAAAAdummykey');

    cy.get('.pf-c-modal-box__footer > .pf-m-primary').click(); // in-modal DOwnload ISO button
    cy.get('.pf-c-title').contains('Download discovery ISO');
    cy.get('.pf-c-empty-state__body').contains('Discovery image is being prepared');

    // TODO(mlibra): verify actual file download

    cy.get('.pf-c-empty-state__secondary > .pf-c-button').click(); // Cancel
    cy.get('.pf-c-modal-box').should('not.be.visible'); // modal closed
  });
});
