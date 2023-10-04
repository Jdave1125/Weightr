import React from "react";
import Logger from "./log";// Create a DailyLog component to display daily logs
import '/home/jdave1125/Weightr/src/dailylogs.css'
function calculateAverages(logs) {
    // Initialize variables to store sum of weight and calories
    let totalWeight = 0;
    let totalCalories = 0;
  
    // Calculate sum of weight and calories
    for (const log of logs) {
      totalWeight += parseFloat(log.weight);
      totalCalories += parseFloat(log.calories);
    }
  
    // Calculate averages
    const averageWeight = totalWeight / logs.length;
    const averageCalories = totalCalories / logs.length;
  
    return { averageWeight, averageCalories };
  }
  
  function Week({ logs }) {
    // Check if the week meets capacity
    const isFullWeek = logs.length === 7;
  
    // Calculate averages if it's a full week
    const averages = isFullWeek ? calculateAverages(logs) : null;
  
    return (
      <div className="week">
        {logs.map((log, index) => (
          <Logger key={index} log={log} />
        ))}
        {isFullWeek && (
          <div className="averages">
            <p>Average Weight: {averages.averageWeight.toFixed(2)} lbs</p>
            <p>Average Calories: {averages.averageCalories.toFixed(2)}</p>
          </div>
        )}
      </div>
    );
  }
  
export default Week;