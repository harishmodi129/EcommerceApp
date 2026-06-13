import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function withRouter(WrappedComponent) {
  function ComponentWithRouterProps(props) {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    return (
      <WrappedComponent
        {...props}
        params={params}
        navigate={navigate}
        location={location}
      />
    );
  }

  const name =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  ComponentWithRouterProps.displayName = `withRouter(${name})`;

  return ComponentWithRouterProps;
}

export default withRouter;
