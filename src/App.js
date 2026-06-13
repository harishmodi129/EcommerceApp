import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import HomePage from "./components/HomePage";
import ProductDetailPage from "./components/ProductDetail";
import Footer from "./components/Footer";
class App extends React.Component {
  render() {
    return (
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/product/:id/details"
              element={<ProductDetailPage />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    );
  }
}

export default App;
