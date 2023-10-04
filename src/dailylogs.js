import React, { useState } from "react";
import "/home/jdave1125/Weightr/src/dailylogs.css";

//this component takes onLogSubmit as a prop from App.js (parent) -- this gives us access to handleFormSubmit
function DailyLogForm({onLogSubmit}) {
  //init weight and calories states
  const [weight, setWeight] = useState("");
  const [calories, setCalories] = useState("");

  //handle form submissions here
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    //prevent default form submission, dont want a reload!!
    //create data obj passing in weight and calories from state
    const data = {
      weight,
      calories,
    };
   
    try {
      const response = await fetch("http://localhost:3001/daily-logs", { 
        method: "POST",  //sending POST req with JSON'ed data (submitting our data)
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Data saved successfully");
        setWeight("");  //if successful, new state (form input bars are cleared)
        setCalories("");
        onLogSubmit(data) //call the onLogSubmit callback on our data --> handleFormSubmit(data) -->handles our form submission (read app.js to see what exactly happen)
      } else {
        console.error("Error while saving data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (  //render the form itself below
    <div className='daily-log-form'>
      <h2>Daily Log</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='weight'>Weight (lbs):</label>
          <input
            type='number'
            id='weight'
            value={weight}
            onChange={(e) => setWeight(e.target.value)}  //event handler, when content of this weight field changes, setWeight to whatever weight was provided in the input
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='calories'>Calories:</label>
          <input
            type='number'
            id='calories'
            value={calories}
            onChange={(e) => setCalories(e.target.value)} //same as weight EH above but with calories
            required
          />
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default DailyLogForm;
