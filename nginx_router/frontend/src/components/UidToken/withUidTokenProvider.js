import React from "react";
import UidTokenContext from "./context";
import { withFirebase } from "../Firebase";

const withUidTokenProvider = Component => {
  class WithUidTokenProvider extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        uidToken: null
      };
    }

    componentDidMount() {
      // set to auth user if succeeded, otherwise set ot null
      // called whenever user sign in state changes in firebase
      // since all components have App as parent, the authUser will be changed throughout app
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        this.props.firebase
          .getUserToken()
          .then(uidToken => {
            this.setState({ uidToken });
          })
          .catch(error => {
            console.log("Failed to get user token");
          });
      });
    }

    render() {
      return (
        <UidTokenContext.Provider value={this.state.uidToken}>
          <Component {...this.props} />
        </UidTokenContext.Provider>
      );
    }
  }
  return withFirebase(WithUidTokenProvider);
};

export default withUidTokenProvider;
