import React from "react";
import "./TimeLabel.css";

const TimeLabel = ({ label }) => {
  label = label.toUpperCase();
  return <span className="time-label">{label}</span>;
};

export default TimeLabel;
