describe("Product Detail Page", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForProducts();
    cy.get('[data-testid="product-card"]').first().click();
  });

  it("displays product detail content", () => {
    cy.get('[data-testid="product-detail"]').should("be.visible");
  });

  it("shows product title", () => {
    cy.get('[data-testid="product-title"]').should("not.be.empty");
  });

  it("shows product price with $ sign", () => {
    cy.get('[data-testid="product-price"]').should("contain", "$");
  });

  it("shows product main image", () => {
    cy.get('[data-testid="product-main-image"]').should("be.visible");
  });

  it("shows Add to My Cart button", () => {
    cy.get('[data-testid="add-to-cart-button"]').should(
      "contain",
      "Add to My Cart"
    );
  });

  it("back button navigates to home page", () => {
    cy.get('[data-testid="back-button"]').click();
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });

  it("direct URL without state shows not-found message", () => {
    cy.visit("/product/999/details");
    cy.get('[data-testid="product-not-found"]').should("be.visible");
  });
});
