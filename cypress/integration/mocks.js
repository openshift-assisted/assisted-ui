export const createMockContext = () => ({
  xhrData: [],
});

export const mockBeforeEach = (context) => () => {
  if (Cypress.env('MOCK_RECORD')) {
    cy.intercept(
      {
        method: '*',
        url: '**/api/assisted-install/v1/**',
      },
      (request) => {
        if (Cypress.env('MOCK_RECORD')) {
          const url = request?.url;
          const method = request?.method;
          // TODO(mlibra): other params for PATCH/POST
          request.reply((response) => {
            const data = response?.body;
            context.xhrData.push({ url, method, data });
          });
        }
      },
    );
  }

  if (Cypress.env('MOCK_REPLAY')) {
    cy.fixture(Cypress.spec.name).then((data) => {
      for (let i = 0, length = data.length; i < length; i++) {
        cy.intercept(data[i].method, data[i].url, data[i].data);
      }
    });
  }
};

export const mockAfter = (context) => () => {
  if (Cypress.env('MOCK_RECORD')) {
    const path = `./cypress/fixtures/${Cypress.spec.name}.json`;
    cy.writeFile(path, context.xhrData);
  }
};
