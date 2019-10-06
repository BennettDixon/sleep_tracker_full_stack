import React from "react";

import { compose } from "recompose";

import { PGUserContext } from "./context";

import { withFirebase } from "../Firebase";
import { withApollo } from "../Apollo";

const INITIAL_STATE = {
  pgUser: null
};

const withPGUserProvider = Component => {
  class WithPGUserProvider extends React.Component {
    constructor(props) {
      super(props);
      this.state = INITIAL_STATE;
    }

    updateUser = () => {
      console.log("getting pgUser");
      this.props.firebase.getUserToken().then(token => {
        this.props.apollo.getProgrammer(token).then(resp => {
          this.setState({ pgUser: resp.data.programmer });
        });
      });
    };

    componentDidMount() {
      // once user authenticates then grab user from postgres and setState
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        this.updateUser
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <PGUserContext.Provider value={this.state.pgUser}>
          <Component {...this.props} />
        </PGUserContext.Provider>
      );
    }
  }
  return compose(
    withFirebase,
    withApollo
  )(WithPGUserProvider);
};

export default withPGUserProvider;
