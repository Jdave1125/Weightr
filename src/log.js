import React from "react";

function logger({ log }) {
  return (
    <div className="daily-log">
      <p>Weight (lbs): {log.weight}</p>
      <p>Calories: {log.calories}</p>
    </div>
  );
}

export default logger;