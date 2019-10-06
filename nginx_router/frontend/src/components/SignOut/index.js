import Button from "react-bootstrap/Button";
import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import * as ROUTES from "../../constants/routes";

class SignOutButtonBase extends Component {
  signOut = event => {
    this.props.firebase.doSignOut();
    this.props.history.push(ROUTES.SIGN_IN);
  };

  render() {
    return (
      <Button variant="outline-danger" onClick={this.signOut} size="lg">
        Sign Out
      </Button>
    );
  }
}

const SignOutButton = compose(
  withFirebase,
  withRouter
)(SignOutButtonBase);

export default SignOutButton;
