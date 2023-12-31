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
        const currentWeek = [...prevWeeks[0], { id:generateId(),weight,calories}];
        console.log("updated:",currentWeek)
        return [currentWeek, ...prevWeeks.slice(1)];
      });
    } else {
      setWeeklyLogs((prevWeeks) => {
        const newWeek = [{ id:generateId(),weight,calories}];
        console.log('updated new week:',newWeek);
        return [newWeek, ...prevWeeks]
      });
    // <DailyLogForm onLogSubmit={handleLogSubmit} />;
  };
}

const generateId = () =>{
  return Math.random().toString(36).substring(7);
}

const handleDelete = (logId) => {
  setWeeklyLogs((prevWeeks) =>{
    const updated = prevWeeks.map((week) =>{
      return week.filter((log) => log.id !== logId);
    })
    return updated
  })
}
 //main app structure -- pass down onLogSubmit prop which is the handleLogSubmit function
  return (
    
    <div className="app-container">
        {authenticated && (
            <div className="sidebar">
                <h2>Navigation</h2>
                <ul>
                    <li><a href="#">Daily Log</a></li>
                    <li><a href="#">Progress Photos</a></li>
                    <li><a href="#">Excercise Log</a></li>
                    <li><a href="#">Mental Notes</a></li>
                    <li><a href="#">Useful Links</a></li>
                </ul>
    </div>
  )}
    
    
    
    
    
    
    
    <div className="main-container">
      
       {authenticated && (
        <>
      
          <div className="main-content">
            <h1 className="main-h1">Weightr </h1>
             
            <DailyLogForm onLogSubmit={handleLogSubmit} />
            {weeklyLogs.map((week, index) => {
                return <Week key={index} logs={week} onDelete={handleDelete} />; //map thru weeklylogs state, render week for each week of logs
             })}
              <button className='logout' onClick={handleLogout}>Logout</button> 
         </div>
        </>
       
       )}
        {!authenticated && <Login onLogin={handleLogin} />}
       </div>
    </div>
  );
}

export default App;
