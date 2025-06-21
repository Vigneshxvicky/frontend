import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const HabitProgress = ({ value, max, streak }) => (
  <div style={{ width: 48, height: 48 }}>
    <CircularProgressbar
      value={value}
      maxValue={max}
      text={`${streak}d`}
      styles={buildStyles({
        pathColor: value === max ? "#38bdf8" : "#6366f1",
        textColor: "#6366f1",
        trailColor: "#ececf1",
        textSize: "1.2rem",
        strokeLinecap: "round",
      })}
    />
  </div>
);

export default HabitProgress;
