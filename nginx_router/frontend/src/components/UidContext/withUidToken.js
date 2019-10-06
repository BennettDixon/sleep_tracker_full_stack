import React from "react";

import UidContext from "./context";

const withUid = Component => {
  class WithUid extends React.Component {
    render() {
      return (
        <UidContext.Consumer>
          {uid => {
            return <Component {...this.props} uid={uid} />;
          }}
        </UidContext.Consumer>
      );
    }
  }
  return WithUid;
};

export default withUid;
