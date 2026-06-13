describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays the header with ShopApp title", () => {
    cy.contains("ShopApp").should("be.visible");
  });

  it("shows skeleton cards while loading", () => {
    cy.get('[data-testid="skeleton-card"]').should("exist");
  });

  it("displays a grid of products after loading", () => {
    cy.waitForProducts();
    cy.get('[data-testid="product-card"]').should("have.length.greaterThan", 0);
  });

  it("each product card shows name and price", () => {
    cy.waitForProducts();
    cy.get('[data-testid="product-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="card-title"]').should("not.be.empty");
        cy.get('[data-testid="card-price"]').should("contain", "$");
      });
  });

  it("clicking a product navigates to detail page", () => {
    cy.waitForProducts();
    cy.get('[data-testid="product-card"]').first().click();
    cy.url().should("match", /\/product\/\d+\/details/);
  });
});
