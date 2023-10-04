import React, { useEffect, useState } from "react";
import DailyLogForm from "./dailylogs";
import Week from "./week";
import Login from "./Login";

function App() {
  const [weeklyLogs, setWeeklyLogs] = useState([[]]);
  //init weeklyLogs to an empty array
  const[authenticated,setAuthenticated] = useState(false) // init auth to false

  const handleLogin = () =>{
    setAuthenticated(true)
  }
  const handleLogout = () =>{
    localStorage.removeItem("token");
    setAuthenticated(false);
  }
 
 
 
  const handleLogSubmit = (log) => { //log here ref to the submitted data in our dailyLogs.js (think of the flow (onLogSubmit))
    //handle log submissions -> dependent on length of week, once the week is full(7) we need a new week
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
 //main app structure -- pass down onLogSubmit prop which is the handleLogSubmit function
  return (
    <div className="main-container">
      
       {authenticated && (
        <>
      
          <div className="main-content">
            <h1 className="main-h1">Weightr </h1>
             
            <DailyLogForm onLogSubmit={handleLogSubmit} />
            {weeklyLogs.map((week, index) => {
                return <Week key={index} logs={week} />; //map thru weeklylogs state, render week for each week of logs
             })}
              <button className='logout' onClick={handleLogout}>Logout</button> 
         </div>
        </>
       
       )}
        {!authenticated && <Login onLogin={handleLogin} />}
       
    </div>
  );
}

export default App;
