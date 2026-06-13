import React from "react";

const S = {
  card: {
    background: "#fff",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
  },
  imgBlock: {
    width: "100%",
    height: "160px",
    borderRadius: 0,
  },
  body: {
    padding: "14px 16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};

class SkeletonCard extends React.Component {
  render() {
    return (
      <div style={S.card} data-testid="skeleton-card" aria-hidden="true">
        <div className="skeleton" style={S.imgBlock} />
        <div style={S.body}>
          <div className="skeleton" style={{ height: "11px", width: "45%" }} />
          <div className="skeleton" style={{ height: "14px", width: "90%" }} />
          <div className="skeleton" style={{ height: "14px", width: "72%" }} />
          <div
            className="skeleton"
            style={{ height: "20px", width: "32%", marginTop: "4px" }}
          />
        </div>
      </div>
    );
  }
}

export default SkeletonCard;
