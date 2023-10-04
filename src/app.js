import React, { useEffect, useState } from "react";
import DailyLogForm from "./dailylogs";
import Week from "./week";

function App() {
  const [weeklyLogs, setWeeklyLogs] = useState([[]]);

  const handleLogSubmit = (log) => {
    const { weight, calories } = log; //extract just the weight and calories from each log

    if (weeklyLogs[0].length < 7) { //if the week is less than 7 entries(days)
      setWeeklyLogs((prevWeeks) => { 
        const currentWeek = [...prevWeeks[0], {weight,calories}];
        console.log("updated:",currentWeek)
        return [currentWeek, ...prevWeeks.slice(1)];
      });
    } else {
      setWeeklyLogs((prevWeeks) => {
        const newWeek = [{weight,calories}];
        console.log('updated new week:',newWeek);
        return [newWeek, ...prevWeeks]
      });
    // <DailyLogForm onLogSubmit={handleLogSubmit} />;
  };
}

  return (
    <div>
      <h1>Weightr - Your Weight and Calorie Tracker</h1>

      <DailyLogForm onLogSubmit={handleLogSubmit} />
      {weeklyLogs.map((week, index) => {
        return <Week key={index} logs={week} />;
      })}
    </div>
  );
}

export default App;
