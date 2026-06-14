import React from "react";

const S = {
  card: {
    background: "#ffffff",
    borderRadius: "14px",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.22s ease, box-shadow 0.22s ease",
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 28px rgba(0,0,0,0.13)",
  },
  imageWrap: {
    width: "100%",
    paddingTop: "66%",
    position: "relative",
    background: "#f0f0f0",
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  imageHover: {
    transform: "scale(1.06)",
  },
  body: {
    padding: "14px 16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#6366f1",
    background: "#ede9fe",
    borderRadius: "4px",
    padding: "2px 7px",
  },
  title: {
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: 1.45,
    color: "#1a1a2e",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  price: {
    marginTop: "auto",
    paddingTop: "8px",
    fontSize: "17px",
    fontWeight: 800,
    color: "#1a1a2e",
  },
};

class ProductCard extends React.Component {
  state = { hovered: false };

  _cleanImageUrl(url) {
    if (!url) return null;
    return String(url).replace(/[[\]"]/g, "");
  }

  render() {
    const { product, onClick } = this.props;
    const { hovered } = this.state;

    const rawUrl = Array.isArray(product.images)
      ? product.images[0]
      : product.images;
    const imgSrc =
      this._cleanImageUrl(rawUrl) ||
      "https://placehold.co/400x260?text=No+Image";
    const cardStyle = hovered ? { ...S.card, ...S.cardHover } : S.card;
    const imageStyle = hovered ? { ...S.image, ...S.imageHover } : S.image;

    return (
      <article
        data-testid="product-card"
        style={cardStyle}
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
        onClick={() => onClick && onClick(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick && onClick(product)}
        aria-label={`View details for ${product.title}`}
      >
        <div style={S.imageWrap}>
          <img
            src={imgSrc}
            alt={product.title}
            style={imageStyle}
            onError={(e) => {
              e.target.src = "https://placehold.co/400x260?text=No+Image";
            }}
          />
        </div>

        <div style={S.body}>
          {product.category?.name && (
            <span style={S.categoryBadge}>{product.category.name}</span>
          )}
          <p style={S.title} data-testid="card-title">
            {product.title}
          </p>
          <p style={S.price} data-testid="card-price">
            ${Number(product.price).toFixed(2)}
          </p>
        </div>
      </article>
    );
  }
}

export default ProductCard;
