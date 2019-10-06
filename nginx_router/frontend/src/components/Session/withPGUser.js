import React from "react";

import { PGUserContext } from "./context";

const withPGUser = Component => {
  class WithPGUser extends React.Component {
    render() {
      return (
        <PGUserContext.Consumer>
          {pgUser => {
            return <Component {...this.props} pgUser={pgUser} />;
          }}
        </PGUserContext.Consumer>
      );
    }
  }
  return WithPGUser;
};

export default withPGUser;
