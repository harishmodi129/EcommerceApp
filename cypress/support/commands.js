Cypress.Commands.add("waitForProducts", () => {
  cy.get('[data-testid="product-grid"]', { timeout: 15000 }).should(
    "be.visible"
  );
});

Cypress.Commands.add("openFirstProduct", () => {
  cy.waitForProducts();
  cy.get('[data-testid="product-card"]').first().click();
});
