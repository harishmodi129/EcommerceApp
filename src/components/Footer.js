import React from "react";
import { observer } from "mobx-react";
import { CartContext } from "../context/CartContext";

const S = {
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: "58px",
    background: "#1a1a2e",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    zIndex: 200,
    boxShadow: "0 -2px 16px rgba(0,0,0,0.22)",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    fontWeight: 500,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "28px",
    height: "28px",
    padding: "0 8px",
    background: "#6366f1",
    color: "#fff",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 700,
  },
  total: {
    fontSize: "18px",
    fontWeight: 800,
    color: "#86efac",
  },
};

class Footer extends React.Component {
  static contextType = CartContext;

  state = {
    prevCount: 0,
    badgeKey: 0,
  };

  static getDerivedStateFromProps(props, state) {
    return null;
  }

  componentDidUpdate() {
    const store = this.context;
    if (store.totalItems !== this.state.prevCount) {
      this.setState((s) => ({
        prevCount: store.totalItems,
        badgeKey: s.badgeKey + 1,
      }));
    }
  }

  render() {
    const store = this.context;
    const { badgeKey } = this.state;

    return (
      <footer style={S.footer} data-testid="footer">
        <div style={S.left}>
          <span aria-hidden="true">🛒</span>
          <span
            key={badgeKey}
            style={S.badge}
            className="bump"
            data-testid="cart-item-count"
          >
            {store.totalItems}
          </span>
          <span>{store.totalItems === 1 ? "item" : "items"} in cart</span>
        </div>

        <div style={S.total} data-testid="cart-total">
          ${store.totalPrice.toFixed(2)}
        </div>
      </footer>
    );
  }
}

export default observer(Footer);
