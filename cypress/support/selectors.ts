// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    byDataTestID(selector: string): Chainable<Element>;
  }
}

Cypress.Commands.add('byDataTestID', (selector: string) => {
  cy.get(`[data-test-id='${selector}']`);
});
