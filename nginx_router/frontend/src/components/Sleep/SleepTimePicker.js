import React from "react";

import DateTimePicker from "react-datetime-picker";

import Button from "react-bootstrap/Button";

const INITIAL_STATE = {
  startDate: new Date(),
  stopDate: new Date(),
  error: null,
  success: false
};

class SleepTimePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  async submitDate() {
    // if submitDate prop is present and type of function
    if (typeof this.props.submitDate === typeof (() => {})) {
      var resp = await this.props.submitDate(
        this.state.startDate,
        this.state.stopDate
      );
      if (!resp) {
        // same day
        this.setState({
          error: "Already sleep entry for this day",
          success: false
        });
      } else {
        this.setState({ error: null, success: true });
      }
    }
  }

  onStopChange = date => {
    this.setState({ stopDate: date });
  };

  onStartChange = date => {
    this.setState({ startDate: date });
  };

  render() {
    return (
      <div className="fill">
        {this.state.success ? <p>Added Sleep Time</p> : ""}
        {this.state.error ? (
          <p className="form-error">{this.state.error}</p>
        ) : (
          ""
        )}
        <h3>Start</h3>
        <DateTimePicker
          onChange={this.onStartChange}
          value={this.state.startDate}
          className="date-picker"
        />
        <h3>Stop</h3>
        <DateTimePicker
          onChange={this.onStopChange}
          value={this.state.stopDate}
          className="date-picker"
        />
        <br />
        <Button variant="primary" onClick={this.submitDate.bind(this)}>
          Add
        </Button>
      </div>
    );
  }
}

export default SleepTimePicker;
