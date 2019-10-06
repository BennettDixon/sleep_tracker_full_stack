import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import React, { Component } from "react";

import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import { withApollo } from "../Apollo";

import * as ROUTES from "../../constants/routes";
import "./SignUp.css";

const SignUpPage = () => (
  <div className="centered">
    <h1>Sign Up</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};

/**
 * evaluates if a username contains illegal characters or is too long
 *
 * @param {*} username username to validate against allowed regex
 */
export function validateUsername(username) {
  /*
    * REGEX explanation
        ^         Start of string
        [a-z0-9]  a or b or c or ... z or 0 or 1 or ... 9
        +         one or more times (change to * to allow empty string)
        $         end of string    
        /i        case-insensitive
  */
  const allowed = /^[a-z0-9_]+$/i;
  const maxLength = 15;
  const minLength = 3;

  if (username.length < minLength || username.length > maxLength) {
    let lengthStr =
      username.length < minLength
        ? "length must be greater than " + minLength
        : "length must be less than " + maxLength;
    return {
      valid: false,
      reason: "Username " + lengthStr
    };
  }
  if (username.match(allowed)) {
    return { valid: true, reason: null };
  }
  return {
    valid: false,
    reason:
      "Usernames may only contain alpha-numeric characters (a-Z, 0-9) & underscores (_)"
  };
}

/**
 * validates a password strength
 * doesn't take two passwords because that is not this functions job
 *
 * @param {*} password password to validate
 */
export function validatePassword(password) {
  const allowed = /[a-z0-9!@#$_]+$/i;

  if (password.length < 8) {
    return {
      valid: false,
      reason: "Passwords must be at least 8 characters long"
    };
  }
  if (!password.match(allowed)) {
    return {
      valid: false,
      reason:
        "Passwords may only contain alpha-numeric characters (a-Z, 0-9) & (!, @, #, $, _)"
    };
  }

  return {
    valid: true,
    reason: null
  };
}

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;
    const passResp = validatePassword(passwordOne);
    const userResp = validateUsername(username);
    if (!userResp.valid) {
      // INVALID USERNAME
      this.setState({
        error: {
          message: userResp.reason
        }
      });
    } else if (!passResp.valid) {
      // INVALID PASSWORD
      this.setState({
        error: {
          message: passResp.reason
        }
      });
    } else {
      // VALID, PROCEED WITH REG
      this.props.firebase
        // create the user in firebase
        .doCreateUserWithEmailAndPassword(email, passwordOne)
        .then(authUser => {
          console.log(authUser);
          // fetch the new user's uid token for server verification
          this.props.firebase
            .getUserToken()
            .then(uidToken => {
              // create user in backend db
              this.props.apollo
                .createProgrammer(authUser.user, username, uidToken)
                .then(resp => {
                  if (resp.data.createProgrammer.ok) {
                    // send verification email if succeeded
                    this.props.firebase
                      .doSendEmailVerification()
                      .then(() => {
                        console.log("sent verification email");
                        // finally route to home page and set to initial state (incase page is revisted)
                        this.setState({ ...INITIAL_STATE });
                        this.props.history.push(ROUTES.LEADERBOARD);
                      })
                      .catch(error =>
                        console.log(
                          "failed to send verification email: error: " + error
                        )
                      );
                  } else {
                    // response was failed, username exists is only current reason
                    this.props.firebase.doSignOut();
                    const error = { message: "Username already exists" };
                    this.setState({ error: error });
                  }
                })
                .catch(error => {
                  console.log("error in creating in postgres via graphql");
                  console.log(error);
                });
            })
            .catch(error => {
              console.log("failed to get user token");
            });
        })
        .catch(error => {
          this.setState({ error });
        });
    }
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { username, email, passwordOne, passwordTwo, error } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";

    return (
      <div>
        {error && <p className="Form-error">{error.message}</p>}

        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId="signUp.usernameInput">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              value={username}
              onChange={this.onChange}
              type="text"
              placeholder="username"
              className="control"
            />
          </Form.Group>

          <Form.Group controlId="signUp.emailInput">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              name="email"
              value={email}
              onChange={this.onChange}
              type="email"
              placeholder="name@example.com"
              className="control"
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="signUp.passwordOneInput">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
              className="control"
            />
          </Form.Group>

          <Form.Group controlId="signUp.passwordTwoInput">
            <Form.Label>Verify Password</Form.Label>
            <Form.Control
              name="passwordTwo"
              value={passwordTwo}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
              className="control"
            />
          </Form.Group>

          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="I agree to the privacy policy" />
          </Form.Group>

          <Button
            variation="primary"
            disabled={isInvalid}
            type="submit"
            size="lg"
          >
            Sign Up
          </Button>
        </Form>
      </div>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
  withApollo
)(SignUpFormBase);

export default SignUpPage;
export { SignUpForm, SignUpLink };
