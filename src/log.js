import React from "react";
//component takes in log component which is a single element of the logs array, or more succintly, just a log (check Logger component in week.js)
function logger({ log, onDelete }) { //render log div  --> this is what we see when we submit our data, (what should pop in the week)
 
  const handleDelete =() => {
    onDelete(log.id)
  }
 
 
  return (
    <div className="daily-log">   
      <p>Weight (lbs): {log.weight}</p>
      <p>Calories: {log.calories}</p>
      <button onClick={handleDelete}>Delete</button>
      <hr className="log-separator" />
    </div>
  );
}

export default logger;