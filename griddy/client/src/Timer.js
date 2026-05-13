import React from "react";
import { useState, useEffect } from "react";
import "./styles/Timer.css";

const Timer = ({ stopped }) => {
  const START_TIME = Date.now();
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const deadline = "December, 31, 2023";

  const getTime = () => {
    if (stopped) {
      return;
    }
    const time = Date.now() - START_TIME;
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(deadline), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer">
      {minutes}:{seconds >= 10 ? seconds : `0${seconds}`}
    </div>
  );
};

export default Timer;
