import {
  START_INSTALLATION_TIMEOUT,
  INSTALL_PREPARATION_TIMEOUT,
  CLUSTER_CREATION_TIMEOUT,
  DEFAULT_SAVE_BUTTON_TIMEOUT,
} from './constants';

export const startClusterInstallation = (cy: Cypress.cy) => {
  // it can take time for changes in the previous step to be saved
  cy.get('button[name="install"', { timeout: DEFAULT_SAVE_BUTTON_TIMEOUT }).should('be.visible');
  // wait up to 10 seconds for the install button to be enabled
  cy.get('button[name="install"]', { timeout: START_INSTALLATION_TIMEOUT }).should(($elem) => {
    expect($elem).to.be.enabled;
  });
  cy.get('button[name="install"]').click();
  // wait for the progress description to say "Installing"
  cy.contains('#cluster-progress-status-value', 'Installing', {
    timeout: INSTALL_PREPARATION_TIMEOUT,
  });
};

export const waitForClusterInstallation = (cy: Cypress.cy) => {
  // wait up to 1.5 hours for the progress description to say "Finalizing"
  cy.contains('#cluster-progress-status-value', 'Finalizing', {
    timeout: CLUSTER_CREATION_TIMEOUT,
  });
  // wait up to 1.5 hours for the progress description to say "Installed"
  cy.contains('#cluster-progress-status-value', 'Installed', {
    timeout: CLUSTER_CREATION_TIMEOUT,
  });
};
