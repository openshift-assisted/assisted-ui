import {
  CLUSTER_NAME,
  openCluster,
  startClusterInstallation,
  waitForClusterInstallation,
  downloadFileWithChrome,
} from './shared';

import {
  writeCookieToDisk,
  logOutOCM,
  loginOCM,
  OCM_USER,
  OCM_USER_PASSWORD,
  OCM_COOKIE_NAME,
  OCM_TOKEN_DEST,
} from './ocmShared';

describe('Run install', () => {
  it('can open the cluster details', () => {
    openCluster(CLUSTER_NAME);
  });

  it('run installation', () => {
    startClusterInstallation();
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

describe('Refresh cookie on disk', () => {
  it('refresh cookie', () => {
    if (OCM_USER) {
      logOutOCM();
      loginOCM(OCM_USER, OCM_USER_PASSWORD);
      writeCookieToDisk(OCM_COOKIE_NAME, OCM_TOKEN_DEST);
    }
  });
});
