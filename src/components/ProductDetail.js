import React from "react";
import { observer } from "mobx-react";
import { CartContext } from "../context/CartContext";
import withRouter from "../hocs/withRouter";

const S = {
  page: {
    minHeight: "100vh",
    paddingBottom: "74px",
    background: "#f7f8fa",
  },
  topBar: {
    background: "#ffffff",
    borderBottom: "1px solid #eeeeee",
    padding: "14px 24px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  backBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 700,
    color: "#6366f1",
    padding: 0,
    fontFamily: "inherit",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    transition: "opacity 0.15s",
  },
  content: {
    maxWidth: "920px",
    margin: "0 auto",
    padding: "32px 24px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    alignItems: "start",
  },

  gallery: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  mainImgWrap: {
    width: "100%",
    paddingTop: "72%",
    position: "relative",
    background: "#f0f0f0",
    borderRadius: "14px",
    overflow: "hidden",
  },
  mainImg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "opacity 0.2s",
  },
  thumbsRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  thumbBase: {
    width: "62px",
    height: "62px",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    border: "2.5px solid transparent",
    transition: "border-color 0.15s",
    flexShrink: 0,
  },
  thumbActive: {
    borderColor: "#6366f1",
  },
  thumbImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  info: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  categoryTag: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "#6366f1",
    background: "#ede9fe",
    borderRadius: "4px",
    padding: "3px 9px",
    alignSelf: "flex-start",
  },
  title: {
    fontSize: "26px",
    fontWeight: 800,
    lineHeight: 1.3,
    color: "#1a1a2e",
  },
  price: {
    fontSize: "30px",
    fontWeight: 800,
    color: "#1a1a2e",
  },
  description: {
    fontSize: "14px",
    lineHeight: 1.75,
    color: "#555555",
  },
  addBtnDefault: {
    padding: "15px 0",
    width: "100%",
    background: "#6366f1",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.2s, transform 0.1s",
    marginTop: "6px",
  },
  addBtnSuccess: {
    padding: "15px 0",
    width: "100%",
    background: "#22c55e",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: "6px",
  },

  notFound: {
    textAlign: "center",
    padding: "80px 24px",
    color: "#888",
    fontSize: "15px",
  },
};

const CONTENT_MOBILE_OVERRIDE = `
  @media (max-width: 640px) {
    .detail-content { grid-template-columns: 1fr !important; }
  }
`;

class ProductDetailPage extends React.Component {
  static contextType = CartContext;

  state = {
    activeImage: 0,
    addedSuccess: false,
    successTimeout: null,
  };

  componentWillUnmount() {
    if (this.state.successTimeout) {
      clearTimeout(this.state.successTimeout);
    }
  }

  _getProduct() {
    return this.props.location?.state?.product ?? null;
  }

  _cleanImageUrl(url) {
    if (!url) return "https://placehold.co/600x432?text=No+Image";
    return String(url).replace(/[\[\]"]/g, "");
  }

  _handleAddToCart(product) {
    const store = this.context;
    store.addItem(product);

    if (this.state.successTimeout) {
      clearTimeout(this.state.successTimeout);
    }

    const timeout = setTimeout(
      () => this.setState({ addedSuccess: false, successTimeout: null }),
      1400
    );
    this.setState({ addedSuccess: true, successTimeout: timeout });
  }

  render() {
    const product = this._getProduct();
    const { activeImage, addedSuccess } = this.state;

    return (
      <div style={S.page}>
        <style>{CONTENT_MOBILE_OVERRIDE}</style>

        <div style={S.topBar}>
          <button
            data-testid="back-button"
            style={S.backBtn}
            onClick={() => this.props.navigate("/")}
          >
            ← Home
          </button>
        </div>

        {!product ? (
          <div style={S.notFound} data-testid="product-not-found">
            <p>Product details are not available.</p>
            <p style={{ marginTop: "8px", fontSize: "13px" }}>
              Please go back to the Home Page and click a product.
            </p>
            <button
              style={{
                ...S.addBtnDefault,
                width: "auto",
                padding: "12px 28px",
                marginTop: "20px",
              }}
              onClick={() => this.props.navigate("/")}
            >
              Go to Home
            </button>
          </div>
        ) : (
          <div
            style={S.content}
            className="slide-in-right detail-content"
            data-testid="product-detail"
          >
            <div style={S.gallery}>
              <div style={S.mainImgWrap}>
                <img
                  data-testid="product-main-image"
                  src={this._cleanImageUrl(product.images?.[activeImage])}
                  alt={product.title}
                  style={S.mainImg}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x432?text=No+Image";
                  }}
                />
              </div>

              {product.images?.length > 1 && (
                <div style={S.thumbsRow} data-testid="image-thumbnails">
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      style={
                        activeImage === i
                          ? { ...S.thumbBase, ...S.thumbActive }
                          : S.thumbBase
                      }
                      onClick={() => this.setState({ activeImage: i })}
                    >
                      <img
                        src={this._cleanImageUrl(img)}
                        alt={`${product.title} view ${i + 1}`}
                        style={S.thumbImg}
                        onError={(e) => {
                          e.target.src = "https://placehold.co/62x62?text=?";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={S.info}>
              {product.category?.name && (
                <span style={S.categoryTag}>{product.category.name}</span>
              )}

              <h1 style={S.title} data-testid="product-title">
                {product.title}
              </h1>

              <div style={S.price} data-testid="product-price">
                ${Number(product.price).toFixed(2)}
              </div>

              {product.description && (
                <p style={S.description} data-testid="product-description">
                  {product.description}
                </p>
              )}

              <button
                data-testid="add-to-cart-button"
                style={addedSuccess ? S.addBtnSuccess : S.addBtnDefault}
                className={addedSuccess ? "pulse-green" : ""}
                onClick={() => this._handleAddToCart(product)}
              >
                {addedSuccess ? "✓ Added to Cart!" : "Add to My Cart"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(observer(ProductDetailPage));
