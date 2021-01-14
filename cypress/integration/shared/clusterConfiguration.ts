export const hostDetailSelector = (shiftedRowIndex: number, label: string) =>
  // NOTE: The first row is number 2! Shift your indexes...
  `table > tbody:nth-child(${shiftedRowIndex}) > tr:nth-child(1) > [data-label="${label}"]`;

export const hostsTableHeaderSelector = (label: string) =>
  `table.hosts-table th[data-label="${label}"] > .pf-c-table__button`;

export const actualSorterSelector = 'table.hosts-table .pf-m-selected > .pf-c-table__button';

export const checkValidationMessage = (cy: Cypress.cy, expectedMsg: string) => {
  cy.get(':nth-child(5) > [data-pf-content="true"] > .pf-c-button').contains(
    'The cluster is not ready to be installed yet',
  );

  cy.get('.pf-c-alert-group').should('not.exist');
  cy.get(':nth-child(5) > [data-pf-content="true"] > .pf-c-button').click();
  cy.get('.pf-c-alert').should('be.visible');
  cy.get('.pf-c-alert__description').contains(expectedMsg);

  // Close
  cy.get('.pf-l-split > :nth-child(2) > .pf-c-button').click(); // close alerts
  cy.get('.pf-c-alert').should('not.exist');
};
