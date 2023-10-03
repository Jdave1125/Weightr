import React, { useState } from "react";
import "/home/jdave1125/Weightr/src/dailylogs.css";

function DailyLogForm() {
  // State for storing weight and calorie input values
  const [weight, setWeight] = useState("");
  const [calories, setCalories] = useState("");

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a data object to send to the server
    const data = {
      weight,
      calories,
    };

    try {
      // Make a POST request to your backend API to save the data
      const response = await fetch("http://localhost:3001/daily-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Convert data to JSON format
      });

      if (response.ok) {
        // Data saved successfully, you can perform any necessary actions
        console.log("Data saved successfully");

        // Reset the input fields after successful submission
        setWeight("");
        setCalories("");
      } else {
        // Handle errors here, for example, display an error message
        console.error("Error while saving data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className='daily-log-form'>
      <h2>Daily Log</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='weight'>Weight (lbs):</label>
          <input
            type='number'
            id='weight'
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='calories'>Calories:</label>
          <input
            type='number'
            id='calories'
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default DailyLogForm;
