import {
  TEST_INFRA_CLUSTER_NAME,
  TEST_INFRA_HOSTNAMES,
  visitTestInfraCluster,
} from './shared/testInfraCluster';
import {
  hostsTableHeaderSelector,
  actualSorterSelector,
  hostDetailSelector,
  checkValidationMessage,
} from './shared/clusterConfiguration';
import { waitForClusterState, withValueOf } from './shared/common';
import { PULL_SECRET } from './shared/variables';
import {
  createCluster,
  deleteClusterByName,
  getClusterNameLinkSelector,
  clusterTableCellSelector,
  assertClusterPresence,
  openCluster,
} from './shared/clusterListPage';
import { DEFAULT_API_REQUEST_TIMEOUT, GENERATE_ISO_TIMEOUT } from './shared/constants';
// import { mockAfterEach, mockBeforeEach, createMockContext } from './mocks';

const DISCOVERING_TIMEOUT = 2 * 60 * 1000; // 2 mins

const hostTableColHeaders = [
  'Hostname',
  'Role',
  'Status',
  'Discovered At',
  'CPU Cores',
  'Memory',
  'Disk',
];

describe('Cluster Detail', () => {
  /* TODO(mlibra): mocked environment
  const mockContext = createMockContext();
  beforeEach(() => {
    mockBeforeEach(mockContext)();
    visitTestInfraCluster(cy);
  });
  afterEach(mockAfterEach(mockContext));
  */
  beforeEach(() => {
    visitTestInfraCluster(cy);
  });
  after(() => {
    // Make sure that test-infra cluster is left Ready
    cy.wait(5 * 1000); // Give backend time to potentially switch the status to non-ready

    openCluster(cy, TEST_INFRA_CLUSTER_NAME); // so ID can be read from the URL in the next step
    waitForClusterState(cy, 'ready', 100); // Wait for API

    cy.visit('');
    assertClusterPresence(cy, TEST_INFRA_CLUSTER_NAME); // back to the list page
  });

  it('can render', () => {
    const colHeaderSelector = (label) =>
      `[data-label="${label}"] > .pf-c-table__button > .pf-c-table__button-content > .pf-c-table__text`;

    cy.get('h1').contains('Install OpenShift on Bare Metal with the Assisted Installer');
    cy.get('.pf-c-breadcrumb__list > :nth-child(3)').contains(TEST_INFRA_CLUSTER_NAME);
    cy.get('#form-input-name-field').should('have.value', TEST_INFRA_CLUSTER_NAME);
    cy.get('#form-input-baseDnsDomain-field').should('have.value', 'redhat.com');

    // Column headers
    hostTableColHeaders.forEach((header) => cy.get(colHeaderSelector(header)).contains(header));
  });
  // existing cluster
  it('has all hosts', () => {
    // Hosts count in the host-table header row
    cy.get('#hosts-count').contains('(3)');

    cy.get('table.hosts-table > tbody').should('have.length', TEST_INFRA_HOSTNAMES.length);
    cy.get('table.hosts-table > tbody > tr.pf-c-table__expandable-row:hidden').should(
      'have.length',
      TEST_INFRA_HOSTNAMES.length,
    );
  });

  it('renders empty cluster', () => {
    const dummyClusterName = `empty-cluster-01`; // make the name predictable for mocks
    cy.visit('/clusters');

    createCluster(cy, dummyClusterName, PULL_SECRET);

    cy.get('.pf-c-breadcrumb__list > :nth-child(3)').contains(dummyClusterName);
    cy.get('#form-input-name-field').should('have.value', dummyClusterName);
    cy.get('.pf-c-title').contains('Waiting for hosts...'); // empty state
    cy.get(':nth-child(4) > .pf-c-button').contains('Back to all clusters');
    cy.get(':nth-child(4) > .pf-c-button').click();

    cy.get(`#cluster-link-${dummyClusterName}`).should('exist');
    deleteClusterByName(cy, dummyClusterName);
  });

  it('downloads ISO', () => {
    const dummyClusterName = `empty-cluster-download-iso`;
    cy.visit('/clusters');

    createCluster(cy, dummyClusterName, PULL_SECRET);

    cy.get('.pf-c-breadcrumb__list > :nth-child(3)').contains(dummyClusterName);
    cy.get('#form-input-name-field').should('have.value', dummyClusterName);
    cy.get('.pf-c-title').contains('Waiting for hosts...'); // empty state

    const proxyURLSelector = '#form-input-httpProxy-field';
    const proxyURLSelectorHttps = '#form-input-httpsProxy-field';
    const enableProxyCheckboxSelector = '#form-input-enableProxy-field';
    const proxyURLSelectorHelper = '#form-input-httpProxy-field-helper';
    const sshPublicKeySelector = '#sshPublicKey';

    cy.get('#bare-metal-inventory-button-download-discovery-iso').click(); // Download ISO button
    cy.get('.pf-c-modal-box'); // modal visible
    cy.get('.pf-c-modal-box__title').contains('Generate Discovery ISO');
    cy.get('.pf-c-modal-box__footer > .pf-m-link').click(); // cancel

    cy.get('#bare-metal-inventory-button-download-discovery-iso').click();
    cy.get('.pf-c-modal-box__title').contains('Generate Discovery ISO');
    cy.get(enableProxyCheckboxSelector).should('not.have.attr', 'checked');
    cy.get(proxyURLSelector).should('not.exist');
    cy.get(proxyURLSelectorHttps).should('not.exist');
    cy.get(enableProxyCheckboxSelector).check();
    cy.get(proxyURLSelector).should('be.visible');
    cy.get(proxyURLSelectorHttps).should('be.visible');
    cy.get(enableProxyCheckboxSelector).uncheck();
    cy.get(proxyURLSelector).should('not.exist');
    cy.get(proxyURLSelectorHttps).should('not.exist');

    cy.get(enableProxyCheckboxSelector).check();
    cy.get(proxyURLSelector).should('be.visible');
    cy.get(proxyURLSelector).type('{selectall}{backspace}foobar');
    cy.get(sshPublicKeySelector).focus();
    cy.get(proxyURLSelectorHelper).contains('Provide a valid HTTP URL.'); // validation error
    cy.get(proxyURLSelector).type('{selectall}{backspace}http://foo.com/bar');
    cy.get(sshPublicKeySelector).focus();
    cy.get(proxyURLSelectorHelper).contains('HTTP proxy URL'); // correct

    cy.get(sshPublicKeySelector).type('{selectall}{backspace}ssh-rsa AAAAAAAAdummykey');

    cy.get('.pf-c-modal-box__footer > .pf-m-primary').click(); // in-modal DOwnload ISO button
    cy.get('.pf-c-modal-box__title').contains('Generate Discovery ISO');
    cy.get('.pf-c-empty-state__body', { timeout: GENERATE_ISO_TIMEOUT }).contains(
      'Discovery image is being prepared',
    );

    cy.get(
      '#generate-discovery-iso-modal > .pf-l-bullseye > .pf-c-empty-state > .pf-c-empty-state__content > .pf-c-empty-state__secondary > .pf-c-button',
    ).click(); // Cancel
    cy.get('.pf-c-modal-box').should('not.exist'); // modal closed

    // Clean-up
    cy.get(':nth-child(4) > .pf-c-button').contains('Back to all clusters');
    deleteClusterByName(cy, dummyClusterName);
  });

  it('has correct row-details for a host', () => {
    cy.get(hostDetailSelector(2, 'Hostname')).contains(TEST_INFRA_HOSTNAMES[0]);
    cy.get(hostDetailSelector(3, 'Hostname')).contains(TEST_INFRA_HOSTNAMES[1]);
    cy.get(hostDetailSelector(2, 'Role')).contains('Master');
    cy.get(hostDetailSelector(2, 'Status')).contains('Ready to install');
    cy.get(hostDetailSelector(2, 'Discovered At')).should('not.be.empty');
    cy.get(hostDetailSelector(2, 'CPU Cores')).contains('4');
    cy.get(hostDetailSelector(2, 'Memory')).contains('16.59 GB'); // value can vary over time
    cy.get(hostDetailSelector(2, 'Disk')).contains('120.86 GB');
  });

  it('has correct expandable-details for a host', () => {
    const sectionTitleSelector = (index: number) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-grid > :nth-child(${index}) > .pf-c-content > h3`;
    const hostDetailsSelector = (column: number, row: number) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-grid > :nth-child(${column}) > .pf-c-content > .detail-list > :nth-child(${row})`;
    const nicsTableHeader = (label: string) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-grid > :nth-child(8) > .pf-c-table > thead > tr > [data-label="${label}"]`;
    const nicsTableCell = (row: number, label: string) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-grid > :nth-child(8) > .pf-c-table > tbody > tr:nth-child(${row}) > [data-label="${label}"]`;
    const disksTableHeader = (label: string) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-grid > :nth-child(6) > .pf-c-table > thead > tr > [data-label="${label}"]`;
    const disksTableCell = (row: number, label: string) =>
      `#expanded-content1 > .pf-c-table__expandable-row-content > .pf-l-grid > :nth-child(6) > .pf-c-table > tbody > tr:nth-child(${row}) > [data-label="${label}"]`;

    // Expand detail
    cy.get('#expandable-toggle0').should('not.have.class', 'pf-m-expanded');
    cy.get('#expandable-toggle0').click();
    cy.get('#expandable-toggle0').should('have.class', 'pf-m-expanded');

    // Host Details
    cy.log('Host Details');
    cy.get(sectionTitleSelector(1)).contains('Host Details');
    // first column of details
    cy.get(hostDetailsSelector(2, 1)).contains('UUID');
    cy.get(hostDetailsSelector(2, 2)).should('not.be.empty'); // can vary
    cy.get(hostDetailsSelector(2, 3)).contains('Manufacturer');
    cy.get(hostDetailsSelector(2, 4)).contains('Red Hat');
    cy.get(hostDetailsSelector(2, 5)).contains('Product');
    cy.get(hostDetailsSelector(2, 6)).contains('KVM');
    cy.get(hostDetailsSelector(2, 7)).contains('Serial number');
    cy.get(hostDetailsSelector(2, 8)).contains('-');
    // second column of details
    cy.get(hostDetailsSelector(3, 1)).contains('Memory capacity');
    cy.get(hostDetailsSelector(3, 2)).contains('16.59 GB');
    cy.get(hostDetailsSelector(3, 3)).contains('CPU model name');
    cy.get(hostDetailsSelector(3, 4)).should('not.be.empty'); // can vary
    cy.get(hostDetailsSelector(3, 5)).contains('CPU cores and clock speed');
    cy.get(hostDetailsSelector(3, 6)).contains('cores at');
    cy.get(hostDetailsSelector(3, 6)).contains('MHz');
    cy.get(hostDetailsSelector(3, 7)).contains('CPU architecture');
    cy.get(hostDetailsSelector(3, 8)).contains('x86_64');
    // third column of details
    cy.get(hostDetailsSelector(4, 1)).contains('Hardware type');
    cy.get(hostDetailsSelector(4, 2)).contains('Virtual machine');
    cy.get(hostDetailsSelector(4, 3)).contains('BMC address');
    cy.get(hostDetailsSelector(4, 4)).contains('0.0.0.0');
    cy.get(hostDetailsSelector(4, 5)).contains('Boot mode');
    cy.get(hostDetailsSelector(4, 6)).contains('bios');
    cy.get(hostDetailsSelector(4, 7)).contains('NTP status');
    cy.get(hostDetailsSelector(4, 8)).contains('Synced');

    // Disks table format
    cy.log('Host disks');
    cy.get(sectionTitleSelector(5)).contains('2 Disks');
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
    cy.get(disksTableCell(1, 'Name')).contains('sr0 (boot)');
    cy.get(disksTableCell(1, 'Drive type')).contains('ODD');
    cy.get(disksTableCell(1, 'Size')).contains(' MB'); // can vary
    cy.get(disksTableCell(1, 'Serial')).should('not.be.empty');
    cy.get(disksTableCell(1, 'Model')).contains('QEMU_DVD-ROM');
    cy.get(disksTableCell(1, 'WWN')).should('be.empty');
    cy.get(disksTableCell(2, 'Name')).contains('vda');
    cy.get(disksTableCell(2, 'Drive type')).contains('HDD');
    cy.get(disksTableCell(2, 'Size')).contains('120.00 GB');
    cy.get(disksTableCell(2, 'Serial')).should('be.empty');
    cy.get(disksTableCell(2, 'Model')).should('be.empty');
    cy.get(disksTableCell(2, 'WWN')).should('be.empty');

    // Nics table format
    cy.log('NICs');
    cy.get(sectionTitleSelector(7)).contains('2 NICs');
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
    cy.get(nicsTableCell(1, 'Name')).contains('ens3');
    cy.get(nicsTableCell(1, 'MAC address')).should('not.be.empty');
    cy.get(nicsTableCell(1, 'MAC address')).contains(':'); // value can vary
    cy.log('Is IP address stable?');
    cy.get(nicsTableCell(1, 'IPv4 address')).contains('192.168.126.10/24');
    cy.get(nicsTableCell(1, 'IPv6 address')).contains('/64');
    cy.get(nicsTableCell(1, 'Speed')).contains('N/A');

    // Collapse
    cy.get('#expandable-toggle0').should('have.class', 'pf-m-expanded');
    cy.get('#expandable-toggle0').click();
    cy.get('#expandable-toggle0').should('not.have.class', 'pf-m-expanded');
  });

  it('can be sorted', () => {
    const hostnameSelector = (row: number) =>
      `:nth-child(${row}) > :nth-child(1) > [data-label="Hostname"]`;
    const hostnameHeaderSelector = hostsTableHeaderSelector('Hostname');

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

  it("changes host's role", () => {
    // Assumption: The cluster is in Ready state, which is already checked by assertClusterPresence() vithin beforeEach() hook

    // Hosts are sorted by Hostname by default
    cy.get(actualSorterSelector).contains('Hostname'); // default sorting by Hostname

    cy.get(hostDetailSelector(3, 'Role')).contains('Master'); // 2nd host in the list
    cy.get(hostDetailSelector(3, 'Role')).click();
    cy.get('#worker > .pf-c-dropdown__menu-item').click();
    cy.get(hostDetailSelector(3, 'Role')).contains('Worker');

    checkValidationMessage(
      cy,
      'Clusters with less than 3 dedicated masters or a single worker are not supported.',
    );

    // check cluster validation
    cy.visit('/clusters');
    cy.get(clusterTableCellSelector(TEST_INFRA_CLUSTER_NAME, 'Status')).contains('Draft');
    cy.get(getClusterNameLinkSelector(TEST_INFRA_CLUSTER_NAME)).click();

    // revert change
    // assumption: hosts are sorted by Hostname by default
    cy.get(hostDetailSelector(3, 'Role')).contains('Worker'); // 2nd host in the list
    cy.get(hostDetailSelector(3, 'Role')).click();
    cy.get('#master > .pf-c-dropdown__menu-item').click();
    cy.get(hostDetailSelector(3, 'Role'), { timeout: DEFAULT_API_REQUEST_TIMEOUT }).contains(
      'Master',
    );

    // check cluster validation
    cy.visit('/clusters');
    cy.get(clusterTableCellSelector(TEST_INFRA_CLUSTER_NAME, 'Status')).contains('Ready');
  });

  it('shows list of cluster events', () => {
    const hostsDropdownSelector =
      'div.pf-c-toolbar__content-section > div:nth-child(1) > div > button.pf-c-select__toggle';
    const severityDropdownSelector =
      'div.pf-c-toolbar__content-section > div:nth-child(2) > div > button.pf-c-select__toggle';
    const severityFieldsSelector = 'fieldset[aria-label="Severity"]';
    const selectAllSelector = '#checkbox-select-all-actions';
    const clusterLevelEvents = '#checkbox-cluster-level-action';
    const deletedHostsSelector = '#checkbox-deleted-hosts-action';

    cy.get('#cluster-events-button').click();
    cy.get('.pf-c-modal-box');
    cy.get('.pf-c-modal-box__title').contains('Cluster Events');
    cy.get('.pf-c-table').find('tr').should('have.length.greaterThan', 0);
    cy.get('.pf-c-modal-box__body').scrollTo('bottom');
    cy.get('.pf-c-table tr td:contains("Registered cluster")');

    cy.get(hostsDropdownSelector).click();
    cy.get(selectAllSelector).click();
    cy.get('h2.pf-c-title').contains('No matching events');
    cy.get(clusterLevelEvents).click();
    cy.get('.pf-c-table tr td:contains("Registered cluster")');
    cy.get(hostsDropdownSelector).click();
    cy.get(hostsDropdownSelector).click();
    cy.get(clusterLevelEvents).click();
    cy.get('h2.pf-c-title').contains('No matching events');
    cy.get(hostsDropdownSelector).click();
    cy.get(hostsDropdownSelector).click();
    cy.get(deletedHostsSelector).click();
    cy.get('h2.pf-c-title').contains('No matching events');
    cy.get(selectAllSelector).click();

    cy.get(severityDropdownSelector).click();
    cy.get(severityFieldsSelector).contains('Info');
    cy.get(severityFieldsSelector).contains('Warning');
    cy.get(severityFieldsSelector).contains('Error');
    cy.get(severityFieldsSelector).contains('Critical');

    cy.get('.pf-c-modal-box__footer > .pf-c-button').click(); // close
    cy.get('.pf-c-modal-box').should('not.exist'); // modal closed
  });

  it('disables and enables host in a cluster', () => {
    const hostRow = 2; // conforms first table-row
    const kebabMenuSelector = `.hosts-table > tbody:nth-child(${hostRow}) > tr:nth-child(1) > td.pf-c-table__action > div > button`;

    cy.get(kebabMenuSelector).click(); // first host kebab menu
    cy.get(`#button-disable-in-cluster-${TEST_INFRA_HOSTNAMES[0]}`).contains('Disable in cluster');
    cy.get(`#button-disable-in-cluster-${TEST_INFRA_HOSTNAMES[0]}`).click();
    cy.get(hostDetailSelector(2, 'Status')).contains('Disabled');

    cy.get(kebabMenuSelector).click(); // first host kebab menu
    cy.get(`#button-enable-in-cluster-${TEST_INFRA_HOSTNAMES[0]}`).contains('Enable in cluster');
    cy.get(`#button-enable-in-cluster-${TEST_INFRA_HOSTNAMES[0]}`).click();
    cy.get(hostDetailSelector(2, 'Status')).contains('Discovering');
    cy.get(hostDetailSelector(2, 'Status')).contains('Ready to install', {
      timeout: DISCOVERING_TIMEOUT,
    });

    // wait for cluster status to be "Ready"
    waitForClusterState(cy, 'ready', 100);
    assertClusterPresence(cy, TEST_INFRA_CLUSTER_NAME);
  });
});
