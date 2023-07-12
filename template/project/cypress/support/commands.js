/// <reference types="cypress" />

const port = Cypress.env('port') || 8081;
const baseUrl = `http://localhost:${port}`;

Cypress.Commands.add('clickMultiple', { prevSubject: 'element' }, (subject, count) => {
  for (let n = 0; n < count; n++) {
    cy.get(subject).click({ force: true });
  }
});

Cypress.Commands.add('getCy', (selector) => {
  return cy.get(`[data-cy=${selector}]`);
});

Cypress.Commands.add('getCyWrap', (selection) => {
  const { selector, prefix = '', suffix = '' } = selection;
  return cy.get(`${prefix}[data-cy='${selector}'] ${suffix}`);
});

Cypress.Commands.add('navigateToBase', (timeToWait = 500) => {
  return cy.visit(baseUrl).then((win) => {
    cy.wait(timeToWait).then(() => {
      return {
        globals: win.app.config?.globalProperties,
        store: win.store,
      };
    });
  });
});
