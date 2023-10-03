import React, { useEffect, useState } from "react";
import DailyLogForm from "./dailylogs";
import Week from "./week";

function App() {
  const [weeklyLogs, setWeeklyLogs] = useState([]);

  useEffect(() => {
    fetch("/weekly-logs")
      .then((response) => response.json())
      .then((data) => setWeeklyLogs(data.data))
      .catch((error) => console.error("Error fetching logs:", error));
  }, []);
  return (
    <div>
      <h1>Weightr - Your Weight and Calorie Tracker</h1>

      <DailyLogForm />
      <Week logs={weeklyLogs} />
    </div>
  );
}

export default App;
