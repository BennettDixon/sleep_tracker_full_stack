import React from "react";
import { compose } from "recompose";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ProgressBar from "react-bootstrap/ProgressBar";

import { Link } from "react-router-dom";

import { withAuthorization } from "../Session";
import { withApollo } from "../Apollo";

import * as ROUTES from "../../constants/routes";

import "./Leaderboard.css";

const INITIAL_STATE = {
  programmers: [{ username: "Loading", lvl: 1, exp: 0 }]
};

export function getExpPercent(user) {
  if (user.exp === 0) {
    return 0;
  }
  let lvlExp = user.lvl * user.scaleRate;
  return (user.exp / lvlExp).toFixed(1) * 100;
}

class LeaderboardBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = INITIAL_STATE;
  }

  componentDidMount() {
    this.props.apollo.getProgrammers().then(resp => {
      const programmers = resp.data.programmers.sort(this.sortOverallLeader);
      this.setState({ programmers: programmers });
    });
  }

  sortOverallLeader(a, b) {
    return b.lvl + b.exp / b.scaleRate - (a.lvl + a.exp / a.scaleRate);
  }

  render() {
    const userlist = this.state.programmers.map((user, i) => (
      <User
        username={user.username}
        rank={i + 1}
        level={user.lvl}
        expPercent={getExpPercent(user)}
      />
    ));

    return (
      <div className="leadcontainer">
        <LeaderboardHeader />
        <ColumnHeader />
        {userlist}
      </div>
    );
  }
}

const LeaderboardHeader = () => {
  return (
    <div className="leadheader">
      <h2>Overall Leaderboard</h2>
    </div>
  );
};

const ColumnHeader = () => (
  <Row className="colheader">
    <Col xs={1}>
      <h4>#</h4>
    </Col>
    <Col xs={3}>
      <h4>Username</h4>
    </Col>
    <Col xs={2}>
      <h4>Level</h4>
    </Col>
    <Col xs={5}>
      <h4>Next Level</h4>
    </Col>
  </Row>
);

const User = ({ rank, username, level, expPercent }) => {
  return (
    <Row className="users" key="username">
      <Col className="rank" xs={1}>
        <h4>{rank}</h4>
      </Col>
      <Col xs={3}>
        <Link to={ROUTES.USER + "/" + username}>{username}</Link>
      </Col>
      <Col className="rank" xs={2}>
        <h4>{level}</h4>
      </Col>
      <Col className="exp-bar" xs={5}>
        <ProgressBar
          now={expPercent}
          label={expPercent !== 0 ? `${expPercent}%` : ""}
        />
      </Col>
    </Row>
  );
};

const viewable = authUser => authUser != null;

const LeaderboardPage = compose(
  withAuthorization(viewable),
  withApollo
)(LeaderboardBase);

export default LeaderboardPage;
