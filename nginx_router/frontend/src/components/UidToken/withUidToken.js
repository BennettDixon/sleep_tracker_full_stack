import React from "react";

import UidTokenContext from "./context";

const withUidToken = Component => {
  class WithUidToken extends React.Component {
    render() {
      return (
        <UidTokenContext.Consumer>
          {uidToken => {
            return <Component {...this.props} uidToken={uidToken} />;
          }}
        </UidTokenContext.Consumer>
      );
    }
  }
  return WithUidToken;
};

export default withUidToken;
