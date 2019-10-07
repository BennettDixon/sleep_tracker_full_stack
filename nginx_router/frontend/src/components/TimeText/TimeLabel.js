import React from "react";
import "./TimeLabel.css";

const TimeLabel = ({ label, fontSize }) => {
  label = label.toUpperCase();
  if (fontSize === undefined || fontSize === null) {
    fontSize = 15;
  }
  const fontSizeStyle = {
    fontSize: fontSize
  };
  return (
    <span style={fontSizeStyle} className="time-label">
      {label}
    </span>
  );
};

export default TimeLabel;
