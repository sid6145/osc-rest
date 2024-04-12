import React, { useEffect } from "react";
import "./Status.css";
import useSocket from "../../customHooks/useSocket";
import { useSelector } from "react-redux";

const Status = ({className}) => {
  const {isSocketConnected: connected} = useSelector(state => state.dashboardSlice)
  console.log("connected", connected)
  return (
    <div
      className={`status-root ${connected ? "connected" : ""} ${
        className || ""
      }`}
    >
      <h4>{connected ? "Live" : "Connecting"}</h4>
    </div>
  );
};

export default Status;
