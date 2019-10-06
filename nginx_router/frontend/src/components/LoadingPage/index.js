import React from "react";

import Spinner from "react-bootstrap/Spinner";

const LoadingPage = Component => {
  return (
    <div className="centered">
      <Spinner
        className="loading-page-spinner"
        animation="border"
        variant="primary"
      />
    </div>
  );
};

export default LoadingPage;
