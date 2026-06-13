describe("Cart Functionality", () => {
  beforeEach(() => {
    cy.clearLocalStorage("shopapp_cart_v2");
    cy.visit("/");
    cy.waitForProducts();
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="product-detail"]').should("be.visible");
  });

  it("footer is visible on detail page", () => {
    cy.get('[data-testid="footer"]').should("be.visible");
  });

  it("footer shows 0 items initially", () => {
    cy.get('[data-testid="cart-item-count"]').should("contain", "0");
    cy.get('[data-testid="cart-total"]').should("contain", "$0.00");
  });

  it("adding item updates cart count in footer", () => {
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.get('[data-testid="cart-item-count"]').should("contain", "1");
  });

  it("adding item updates cart total in footer", () => {
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.get('[data-testid="cart-total"]').should("not.contain", "$0.00");
  });

  it("button shows success state after adding", () => {
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.get('[data-testid="add-to-cart-button"]').should(
      "contain",
      "✓ Added to Cart!"
    );
  });

  it("button reverts back after success state", () => {
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.wait(1600);
    cy.get('[data-testid="add-to-cart-button"]').should(
      "contain",
      "Add to My Cart"
    );
  });

  it("adding same product twice increments quantity", () => {
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.wait(1600);
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.get('[data-testid="cart-item-count"]').should("contain", "2");
  });

  it("cart persists after page refresh", () => {
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.get('[data-testid="cart-item-count"]').should("contain", "1");
    cy.reload();
    cy.get('[data-testid="cart-item-count"]').should("contain", "1");
  });
});
