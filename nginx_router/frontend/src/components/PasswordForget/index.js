import React, { Component } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { Link } from "react-router-dom";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const PasswordForgetPage = () => (
  <div className="centered">
    <h3>Forgotten Password</h3>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: "",
  error: null,
  alert: null,
  alertVariant: "primary"
};
class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;
    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.setState({
          alert: "Sent email",
          alertVariant: "primary"
        });
      })
      .catch(error => {
        this.setState({
          alert: "There is no account matching that address",
          alertVariant: "danger"
        });
      });
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  closeAlert = event => {
    this.setState({ alert: null });
  };

  render() {
    const { email, error } = this.state;
    const isInvalid = email === "";
    return (
      <Form onSubmit={this.onSubmit}>
        {this.state.alert ? (
          <Alert
            variant={this.state.alertVariant}
            onClose={this.closeAlert}
            dismissible
          >
            {this.state.alert}
          </Alert>
        ) : (
          ""
        )}

        {error && <p className="Form-error">{error.message}</p>}

        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            name="email"
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={this.onChange}
          ></Form.Control>
        </Form.Group>
        <Button variant="primary" disabled={isInvalid} type="submit" size="lg">
          Reset Password
        </Button>
      </Form>
    );
  }
}
const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);
export default PasswordForgetPage;
const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
export { PasswordForgetForm, PasswordForgetLink };
