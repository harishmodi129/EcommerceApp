import React from "react";
import { observer } from "mobx-react";
import {
  fetchProducts,
  fetchProductsByCategory,
  fetchCategories,
} from "../apiClient";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import withRouter from "../hocs/withRouter";

const S = {
  page: {
    minHeight: "100vh",
    paddingBottom: "74px",
    background: "#f7f8fa",
  },
  header: {
    background: "#1a1a2e",
    color: "#fff",
    padding: "20px 24px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: 800,
    letterSpacing: "-0.4px",
  },
  headerSub: {
    fontSize: "12px",
    color: "#9090b0",
    marginTop: "2px",
    fontWeight: 400,
  },

  filterBar: {
    padding: "14px 24px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    background: "#ffffff",
    borderBottom: "1px solid #eeeeee",
  },
  filterBtnBase: {
    padding: "7px 16px",
    borderRadius: "20px",
    border: "1.5px solid #d1d5db",
    background: "#ffffff",
    color: "#555555",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s ease",
  },
  filterBtnActive: {
    padding: "7px 16px",
    borderRadius: "20px",
    border: "1.5px solid #6366f1",
    background: "#6366f1",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s ease",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
    padding: "24px",
  },
  errorBox: {
    textAlign: "center",
    padding: "64px 24px",
    color: "#888",
    fontSize: "15px",
  },
  retryBtn: {
    marginTop: "16px",
    padding: "10px 24px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  emptyBox: {
    textAlign: "center",
    padding: "64px 24px",
    color: "#aaa",
    fontSize: "15px",
  },
};

class HomePage extends React.Component {
  state = {
    products: [],
    categories: [],
    selectedCategoryId: null,
    loading: true,
    error: null,
  };

  componentDidMount() {
    this._loadCategories();
    this._loadProducts();
  }

  async _loadCategories() {
    try {
      const categories = await fetchCategories();
      this.setState({ categories });
    } catch (err) {
      console.error("[HomePage] categories fetch error:", err);
    }
  }

  async _loadProducts() {
    this.setState({ loading: true, error: null });
    try {
      const products = await fetchProducts(60);
      this.setState({ products, loading: false });
    } catch (err) {
      console.error("[HomePage] fetch error:", err);
      this.setState({
        loading: false,
        error:
          "Could not load products. Please check your connection and try again.",
      });
    }
  }

  async _loadProductsByCategory(categoryId) {
    this.setState({ loading: true, error: null });
    try {
      const products = await fetchProductsByCategory(categoryId, 60);
      this.setState({ products, loading: false });
    } catch (err) {
      console.error("[HomePage] category fetch error:", err);
      this.setState({
        loading: false,
        error: "Could not load products for this category. Try again.",
      });
    }
  }

  _handleCategorySelect(categoryId) {
    const next =
      this.state.selectedCategoryId === categoryId ? null : categoryId;
    this.setState({ selectedCategoryId: next });

    if (next === null) {
      this._loadProducts();
    } else {
      this._loadProductsByCategory(next);
    }
  }

  _openProduct(product) {
    this.props.navigate(`/product/${product.id}/details`, {
      state: { product },
    });
  }

  render() {
    const {
      products,
      categories,
      selectedCategoryId,
      loading,
      error,
    } = this.state;

    return (
      <div style={S.page}>
        <header style={S.header}>
          <div style={S.headerTitle}>ShopApp</div>
          <div style={S.headerSub}>Browse our collection</div>
        </header>

        {categories.length > 0 && (
          <div style={S.filterBar} data-testid="filter-bar">
            <button
              data-testid="filter-all"
              style={
                selectedCategoryId === null
                  ? S.filterBtnActive
                  : S.filterBtnBase
              }
              onClick={() => this._handleCategorySelect(null)}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                data-testid={`filter-category-${cat.id}`}
                style={
                  selectedCategoryId === cat.id
                    ? S.filterBtnActive
                    : S.filterBtnBase
                }
                onClick={() => this._handleCategorySelect(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div style={S.errorBox}>
            <p>{error}</p>
            <button
              style={S.retryBtn}
              onClick={() =>
                selectedCategoryId
                  ? this._loadProductsByCategory(selectedCategoryId)
                  : this._loadProducts()
              }
            >
              Retry
            </button>
          </div>
        )}

        {loading && !error && (
          <div style={S.grid}>
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div style={S.grid} data-testid="product-grid">
            {products.map((product, idx) => (
              <div
                key={product.id}
                className="fade-in-up"
                style={{ animationDelay: `${Math.min(idx * 25, 350)}ms` }}
              >
                <ProductCard
                  product={product}
                  onClick={(p) => this._openProduct(p)}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div style={S.emptyBox} data-testid="empty-state">
            <p>No products found in this category.</p>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(observer(HomePage));
