import "./nav.css";

import React from "react";
import { Link } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import * as ROUTES from "../../constants/routes";
import * as NAMES from "../../constants/names";

import { AuthUserContext } from "../Session";

const Navigation = ({ authUser }) => (
  <AuthUserContext.Consumer>
    {authUser => (authUser ? <NavigationAuth /> : <NavigationNonAuth />)}
  </AuthUserContext.Consumer>
);

const INITIAL_STATE = {
  searchQuery: "",
  problemQuerySet: []
};

class NavigationAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <Navbar sticky="top" bg="light" variant="light" className="Nav-bar">
        <Navbar.Brand>
          <Link className="Nav-bar-link" to={ROUTES.LANDING}>
            {NAMES.APP_NAME}
          </Link>
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link>
            <Link className="Nav-bar-link" to={ROUTES.LEADERBOARD}>
              Leaderboard
            </Link>
          </Nav.Link>

          <Nav.Link>
            <Link className="Nav-bar-link" to={ROUTES.PROBLEMS}>
              Problems
            </Link>
          </Nav.Link>

          <Nav.Link>
            <Link className="Nav-bar-link" to={ROUTES.ACCOUNT}>
              Account
            </Link>
          </Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}

const NavigationNonAuth = () => (
  <Navbar sticky="top" bg="light" variant="light">
    <Navbar.Brand>
      <Link className="Nav-bar-link" to={ROUTES.LANDING}>
        {NAMES.APP_NAME}
      </Link>
    </Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link>
        <Link className="Nav-bar-link" to={ROUTES.SIGN_IN}>
          Sign In
        </Link>
      </Nav.Link>
    </Nav>
  </Navbar>
);

export default Navigation;
