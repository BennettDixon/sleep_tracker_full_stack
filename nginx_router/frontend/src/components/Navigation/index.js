import "./nav.css";

import React from "react";
import { Link } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import * as ROUTES from "../../constants/routes";
import * as NAMES from "../../constants/names";

// TODO implement returning a NavigationNonAuth once user management is implemented
const Navigation = () => <NavigationAuth />;

const INITIAL_STATE = {
  auth: true
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
            <Link className="Nav-bar-link" to={ROUTES.SLEEP_CHARTS}>
              My Sleep
            </Link>
          </Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}

export default Navigation;
