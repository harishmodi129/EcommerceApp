import React from "react";
import cartStore from "../store/CartStore";

export const CartContext = React.createContext(null);

export class CartProvider extends React.Component {
  render() {
    return (
      <CartContext.Provider value={cartStore}>
        {this.props.children}
      </CartContext.Provider>
    );
  }
}
