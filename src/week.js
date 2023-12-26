import React from "react";
import Logger from "./log";// Create a DailyLog component to display daily logs
import '/home/jdave1125/Weightr/src/dailylogs.css'
function calculateAverages(logs) {  //calc averages of a particular WEEK (logs == 1 week)
    // Initialize variables to store sum of weight and calories
    let totalWeight = 0;
    let totalCalories = 0;
  
    // Calculate sum of weight and calories
    for (const log of logs) {
      totalWeight += parseFloat(log.weight); //for each log in the logs array, we add its weight and calories to the totals
      totalCalories += parseFloat(log.calories);
    }
  
    // Calculate averages
    const averageWeight = totalWeight / logs.length;
    const averageCalories = totalCalories / logs.length;
  
    return { averageWeight, averageCalories };
  }
  
  //function component
  function Week({ logs, onDelete }) {  //logs prop -> daily logs for a week (array)
    // Check if the week meets capacity
    const isFullWeek = logs.length === 7;
  
    // Calculate averages if it's a full week (use our call back we just made above to do so)
    const averages = isFullWeek ? calculateAverages(logs) : null;
  //then render the div, map thru logs array to render Logger component for each log .. if we have a full week, we want to show the averages
    return (
      <div className="week">
        {logs.map((log, index) => ( //map over logs array (the week) and for each instance of a log(Logger comp), we render the log(Logger which displays weight/cals (look at log.js)) 
          <Logger key={index} log={log} onDelete={onDelete}/>
        ))} 
        {isFullWeek && (
          <div className="averages">  
            <p>Average Weight: {averages.averageWeight.toFixed(2)} lbs</p>
            <p>Average Calories: {averages.averageCalories.toFixed(2)}</p>
          </div>
        )}
      </div>//if a full week -> && is used to conditionally render if the week is full (in place of if statement)
    );
  }
  
export default Week;