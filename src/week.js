import React, { useEffect, useState } from "react";
import "/home/jdave1125/Weightr/src/week.css";

function Week({ logs }) {
  return (
    <div className='week-container'>
      <h2> Weekly Logs</h2>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className='log-entry'>
            {/* Render log data here */}
            <p>Weight: {log.weight} lbs</p>
            <p>Calories: {log.calories}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Week;
